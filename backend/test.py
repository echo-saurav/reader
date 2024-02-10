import threading
import time

class Test:
    def search_file_cache(self, path):
        for item in self.cache_files:
            if item['path'] == path:
                return item
        return None

    def modify_last_mod(self, path, new_last_mod):
        found = False
        for item in self.cache_files:
            if item['path'] == path:
                item['last_mod'] = new_last_mod
                found = True
                break

        if not found:
            self.cache_files.append({"path":path, 'last_mod':new_last_mod})


    def scan(self,i):
        # with self.lock:
        current_time = time.time()
        config_file = self.search_file_cache(i)

        if config_file:
            last_diff = current_time - config_file['last_mod']
            if last_diff > self.max_time:
                diff = current_time - self.last_trigger_time
                print(f"{i}. last diff: {last_diff} , diff: {diff} current_time:{current_time}")
                self.last_trigger_time = current_time
        
        else:
            diff = current_time - self.last_trigger_time
            print(f"{i}. diff: {diff} current_time:{current_time}")
            self.last_trigger_time = current_time

        self.modify_last_mod(i,current_time)

    
    def start(self):
        print("not using threading")
        for _ in range(10):
            self.scan(1)

    def start_with_threads(self):
        print("using threading")
        for i in range(10):
            thread = threading.Thread(target=self.scan, args=[1])
            self.threads.append(thread)
        
        self.last_trigger_time = time.time()
        for t in self.threads:
            t.start()

        for t in self.threads:
            t.join()

    def __init__(self):
        # self.lock = threading.Lock()
        self.max_time = 0.1
        self.last_trigger_time = 0
        self.cache_files = []
        self.threads=[]
        # self.start_with_threads()
        self.start()

test= Test()



