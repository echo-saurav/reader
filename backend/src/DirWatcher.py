from watchdog.observers import Observer
import glob
from database import DB
import os
from PDFScan import PDFScan
from WatchHandler import WatchHandler


class DirWatcher:
    def scan_files(self):
        print("start scanning files")
        local_files = glob.glob(self.data_dir + '/*.pdf')
        print(f"files count: {len(local_files)}")
        print(f"files{local_files}")

        # add books to database
        for location in local_files:
            file_name = os.path.splitext(os.path.basename(location))[0]
            file_extension = os.path.splitext(location)[1]
            file_path = f"{self.data_dir}/{file_name}{file_extension}"
            total_page = self.pdf_scan.get_total_pages(location)
            book_title = self.pdf_scan.get_book_title(location)
            chapters = self.pdf_scan.get_chapters(location)

            self.db.insert_book_(
                file_name,
                file_path,
                total_page,
                book_title,
                chapters
            )

        # remove books from database
        files_from_database = self.db.get_raw_books()

        def file_exist_locally(path):
            for file in local_files:
                if os.path.normpath(path) == os.path.normpath(file):
                    return True
            return False

        for database_file in files_from_database:
            if not file_exist_locally(database_file.get("path", "")):
                self.db.delete_book(database_file.get("_id"))

    def on_create(self, event):
        src_path = event.src_path
        file_extension = os.path.splitext(src_path)[1]
        # only trigger for pdf file and dir
        if event.is_directory or file_extension != ".pdf":
            return

        file_name = os.path.splitext(os.path.basename(src_path))[0]
        file_path = f"{self.data_dir}/{file_name}{file_extension}"
        total_page = self.pdf_scan.get_total_pages(file_path)
        book_title = self.pdf_scan.get_book_title(file_path)
        chapters = self.pdf_scan.get_chapters(file_path)

        self.db.insert_book_(
            file_name,
            file_path,
            total_page,
            book_title,
            chapters
        )

    def on_modify(self, event):
        print(event)

    def on_delete(self, event):
        src_path = event.src_path
        file_extension = os.path.splitext(src_path)[1]
        # only trigger for pdf file and dir
        if event.is_directory or file_extension != ".pdf":
            return

        base_file_name = os.path.splitext(os.path.basename(src_path))[0]
        file_path = f"{self.data_dir}/{base_file_name}{file_extension}"
        self.db.delete_by_path(file_path)

    def schedule_watchdog_task(self):
        observer = Observer()
        event_handler = WatchHandler(
            on_create=self.on_create,
            on_modify=self.on_modify,
            on_delete=self.on_delete)
        # observer.schedule(event_handler, path=self.BOOK_DIR, recursive=True)
        observer.schedule(event_handler, path=self.data_dir)
        observer.start()
        print("watch do started")

    def reset(self, uid):
        user = self.db.get_user_by_id(uid)
        print("reset user", user)
        if user and user.get("is_admin"):
            try:
                self.db.remove_all_books()
                self.db.remove_all_users()
                self.db.remove_all_user_settings()
                self.db.remove_all_bookmarks()
                self.scan_files()
                return True
            except Exception as e:
                print("reset error", e)
                return False
        return False

    def __init__(self, data_dir, backend_host, database: DB, pdf_scan: PDFScan):
        self.pdf_scan = pdf_scan
        self.db = database
        self.data_dir = data_dir
        self.backend_host = backend_host
        self.last_mtime = None
        self.last_trigger = 0
        self.count = 0
        # initial scan
        # database.remove_all_books()
        # database.remove_all_users()
        # database.remove_all_user_settings()
        # database.remove_all_bookmarks()
        self.scan_files()
        self.schedule_watchdog_task()
