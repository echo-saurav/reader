from watchdog.events import FileSystemEventHandler


class WatchHandler(FileSystemEventHandler):
    def on_created(self, event):
        self.on_event(event)

    def on_deleted(self, event):
        self.on_delete(event)

    def __init__(self, on_event, on_delete):
        self.on_event = on_event
        self.on_delete = on_delete

        #     location = event.src_path
        #     file_name = os.path.splitext(os.path.basename(location))[0]
        #     file_extension = os.path.splitext(location)[1]
        #     file_path = f"{self.data_dir}/{file_name}{file_extension}"

        # def on_any_event(self, event):
        #     if event.is_directory:
        #         return
        #
        #     file_path = event.src_path
        #     file_extension = os.path.splitext(file_path)[1]
        #     # only trigger for pdf file
        #     if file_extension != ".pdf":
        #         return
        #
        #     # time before same path can trigger twice
        #     max_time = 1
        #
        #     cache_file = self.search_file_cache(file_path)
        #     current_time = time.time()
        #     if cache_file:
        #         last_mod_time = cache_file.get("last_mod")
        #
        #         if (current_time - last_mod_time) > max_time:
        #             print("trigger for", file_path)
        #             print(f"current: {current_time} , cache: {self.cache_files}")
        #             self.scan_fun()
        #             self.modify_last_mod(file_path, current_time)
        #         else:
        #             self.modify_last_mod(file_path, current_time)
        #     else:
        #         self.modify_last_mod(file_path, current_time)
        #
        #         print("trigger for", file_path)
        #         print(f"current: {current_time} , cache: {self.cache_files}")
        #         self.scan_fun()
        #
        #     # remove cache que if it's more than max time x 10
        #     if (current_time - self.last_trigger_time) > max_time * 10:
        #         self.cache_files = []
        #         print("clearing cache")
        #     # reset cache timer
        #     self.last_trigger_time = current_time

        # def __init__(self, pdf_scan: PDFScan, data_dir, db: DB, scan_fun,
        #              last_trigger_time, cache_files,
        #              modify_last_mod, search_file_cache
        #              ):
        #     self.pdf_scan = pdf_scan
        #     self.data_dir = data_dir
        #     self.db = db
        #     self.scan_fun = scan_fun
        #     self.last_trigger_time = last_trigger_time
        #     self.cache_files = cache_files
        #     self.search_file_cache = search_file_cache
        #     self.modify_last_mod = modify_last_mod
