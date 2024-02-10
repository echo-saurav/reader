import time
from watchdog.observers import Observer
import glob
from database import DB
import os
from PDFScan import PDFScan
from WatchHandler import WatchHandler

old_file_path = None


class DirWatcher:
    # def trigger(self):
    #     self.last_mtime = os.stat(self.data_dir).st_mtime
    #     if self.last_mtime > self.last_trigger:
    #         print("trigger dir change", self.count)
    #     else:
    #         print("trigger but no change", self.count)
    #     self.last_trigger = time.time()
    #     self.count = self.count + 1

    def scan_files(self):
        files = glob.glob(self.data_dir + '/*.pdf')
        files_from_database = self.db.get_raw_books()

        # add books to database
        for location in files:
            # print(f"loc: {location}")
            file_name = os.path.splitext(os.path.basename(location))[0]
            file_extension = os.path.splitext(location)[1]
            file_path = f"{self.data_dir}/{file_name}{file_extension}"
            total_page = self.pdf_scan.get_total_pages(location)

            self.db.insert_book(
                path=file_path,
                name=file_name,
                description="",
                page_no=total_page
            )

        # remove books from database
        for f in files_from_database:
            if f.get("path", "") not in files:
                self.db.delete_book(f.get("_id"))

    def on_create(self, event):
        src_path = event.src_path
        file_extension = os.path.splitext(src_path)[1]
        # only trigger for pdf file and dir
        if event.is_directory or file_extension != ".pdf":
            return

        base_file_name = os.path.splitext(os.path.basename(src_path))[0]
        file_path = f"{self.data_dir}/{base_file_name}{file_extension}"
        total_page = self.pdf_scan.get_total_pages(file_path)

        self.db.insert_book(
            path=file_path,
            name=base_file_name,
            description="",
            page_no=total_page
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
