import time
from watchdog.observers import Observer
import glob
from database import DB
import os
from PDFScan import PDFScan
from WatchHandler import WatchHandler


class DirWatcher:
    def schedule_watchdog_task(self):
        observer = Observer()
        event_handler = WatchHandler(on_event=self.on_watch_event, on_delete=self.remove_file_cache)
        # TODO: add child dir support
        # observer.schedule(event_handler, path=self.BOOK_DIR, recursive=True)
        observer.schedule(event_handler, path=self.data_dir)
        observer.start()

    def scan_files(self):
        files = glob.glob(self.data_dir + '/*.pdf')
        files_from_database = self.db.get_raw_books()

        # print("Insert Books")
        # print("_" * 50)

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

        # print("Delete Books")
        # print("_" * 50)

        # remove books from database
        for f in files_from_database:
            if f.get("path", "") not in files:
                self.db.delete_book(f.get("_id"))
                # print(f"delete path: {f.get('path')}, id: {f.get('_id')}")

    def search_file_cache(self, path):
        # for item in self.cache_files:
        for item in cache_files:
            if item['path'] == path:
                return item
        return None

    def remove_file_cache(self, event):
        file_path = event.src_path
        self.scan_files()
        # for item in self.cache_files:
        for item in cache_files:
            if item['path'] == file_path:
                # self.cache_files.remove(item)
                cache_files.remove(item)
                print("remove cache", file_path)
                return item
        return None

    def modify_last_mod(self, path, new_last_mod):
        print("pushing file to cache")
        found = False
        # for item in self.cache_files:
        for item in cache_files:
            if item['path'] == path:
                item['last_mod'] = new_last_mod
                found = True
                break

        if not found:
            # self.cache_files.append({"path": path, 'last_mod': new_last_mod})
            cache_files.append({"path": path, 'last_mod': new_last_mod})

    def on_watch_event(self, event):
        file_path = event.src_path
        file_extension = os.path.splitext(file_path)[1]
        # only trigger for pdf file and dir
        if event.is_directory or file_extension != ".pdf":
            return

        current_time = time.time()
        cache_file = self.search_file_cache(file_path)
        self.modify_last_mod(file_path, current_time)
        # cache file found
        if cache_file:
            time_diff = current_time - cache_file.get("last_mod")
            print(f"{current_time} - {cache_file.get('last_mod')} = {time_diff}")
            if time_diff > self.max_time:
                self.scan_files()
                print("found cache")
        else:
            self.scan_files()
            print("no cache")

    # def on_watch_even(self, event):
    #     with self.lock:
    #         file_path = event.src_path
    #         file_extension = os.path.splitext(file_path)[1]
    #         # only trigger for pdf file and dir
    #         if event.is_directory or file_extension != ".pdf":
    #             return
    #
    #         current_time = time.time()
    #         cache_file = self.search_file_cache(file_path)
    #         if not cache_file:
    #             self.cache_files.append({'path': file_path, 'last_mod': current_time})
    #         else:
    #             self.modify_last_mod(file_path, current_time)
    #         print("cache file", self.cache_files)
    #
    #         # cache_file = self.search_file_cache(file_path)
    #         # check if last time exceed max time
    #         if cache_file:
    #             last_mod_time = cache_file.get("last_mod")
    #             time_diff = current_time - last_mod_time
    #             if time_diff > self.max_time:
    #                 self.scan_files()
    #                 print(f"trigger has cache , diff:{time_diff}")
    #                 # print(f"loc: {file_path},time-diff :{time_diff} ,cache :{self.cache_files}")
    #
    #             # update new trigger time
    #             # self.modify_last_mod(file_path, current_time)
    #         # add cache file
    #         else:
    #             self.scan_files()
    #             print("trigger no cache")
    #             # print(f"loc: {file_path}, cache :{self.cache_files}")
    #         # if file_extension != ".pdf":
    #         #     return

    def __init__(self, data_dir, backend_host, database: DB, pdf_scan: PDFScan):
        self.pdf_scan = pdf_scan
        self.db = database
        self.data_dir = data_dir
        self.backend_host = backend_host
        # initial scan
        # database.remove_all_books()
        # database.remove_all_users()
        # database.remove_all_user_settings()
        # database.remove_all_bookmarks()
        self.scan_files()
        self.max_time = 1
        self.last_trigger_time = 0
        # self.cache_files = []
        # self.lock = threading.Lock()
        self.schedule_watchdog_task()
