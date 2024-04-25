from watchdog.events import FileSystemEventHandler


class WatchHandler(FileSystemEventHandler):
    def on_created(self, event):
        self.on_create(event)

    def on_modified(self, event):
        self.on_modify(event)

    def on_deleted(self, event):
        self.on_delete(event)

    def __init__(self, on_create, on_modify, on_delete):
        self.on_create = on_create
        self.on_modify = on_modify
        self.on_delete = on_delete
