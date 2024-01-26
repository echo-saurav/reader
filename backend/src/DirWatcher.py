from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import glob
from database import DB
import os
from bson import ObjectId


class DirWatcher:
    class Handler(FileSystemEventHandler):
        def on_created(self, event):
            if event.is_directory:
                return None
            # print("created")
            # print(event)

        def on_modified(self, event):
            if event.is_directory:
                return None
            # print("modify")
            # print(event)

        def on_deleted(self, event):
            print("delete")

    def schedule_watchdog_task(self):
        observer = Observer()
        event_handler = self.Handler()
        # observer.schedule(event_handler, path=self.BOOK_DIR, recursive=True)
        observer.schedule(event_handler, path=self.data_dir)
        observer.start()
        print("watch do started")

    @staticmethod
    def get_total_pages(pdf_path):
        import fitz
        doc = fitz.open(pdf_path)
        total_pages = doc.page_count
        doc.close()
        return total_pages

    def scan_file(self):
        files = glob.glob(self.data_dir + '/*.pdf')
        for location in files:
            print(f"loc: {location}")
            file_name = os.path.splitext(os.path.basename(location))[0]
            total_page = self.get_total_pages(location)

            book_id = self.db.insert_book(
                path=location,
                name=file_name,
                description="",
                page_no=total_page,
                cover="",
                progress=0
            )
            self.db.update_book_by_object(
                {"_id": ObjectId(book_id)},
                {"cover": f"/book/image/{book_id}/0"}
            )

            print(f"id: {book_id}, loc: {location}")

    def __init__(self, data_dir, backend_host, database: DB):
        self.db = database
        self.data_dir = data_dir
        self.backend_host = backend_host
        # initial scan
        database.remove_all_books()
        database.remove_all_users()
        self.scan_file()
        # self.schedule_watchdog_task()
