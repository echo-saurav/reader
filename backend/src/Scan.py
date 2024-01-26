import json
from PDFScan import PDFScan


class Scanner:
    def get_books(self):
        self.update()
        res = self.json_data['books']
        print(res)
        return res

    def get_book(self, book_id):
        res = {
            "book_id": book_id,
            "name": "Immune: a Journey into the Mysterious System that Keeps You Alive",
            "description": "A gorgeously illustrated deep dive into the immune system that will forever change how you think about your body, from the creator of the popular science YouTube channel Kurzgesagt—In a Nutshell\n\nYou wake up and feel a tickle in your throat. Your head hurts. You're mildly annoyed as you get the kids ready for school and dress for work yourself. Meanwhile, an epic war is being fought, just below your skin. Millions are fighting and dying for you to be able to complain as you head out the",
            "page_no": 55,
            "cover": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617072418i/57423646.jpg",
            "progress": 30
        }
        return res

    def get_pages(self, book_id, page_no, limit=10):
        self.update()
        res = []
        new_limit = limit if page_no + limit < 56 else 56 - page_no
        start = page_no
        end = page_no + new_limit
        print(f"start: {start}, end:{end}, limit {new_limit}")

        for i in range(start, end):
            xrefs = self.pdfScan.get_image_xrefs(pdf_path="src/behave.pdf", page_num=i)
            # ocr_text = self.pdfScan.get_ocr_text(pdf_path="src/behave.pdf", page_num=i)
            ocr_text = ""
            page_content = self.pdfScan.get_page_text(pdf_path="src/behave.pdf", page_num=i)


            res.append({
                # "page_content": "table is is an accessible work for everyone, and its value is in the knowledge it brings forth of various ideologies thereby increasing our own understanding of them - especially in today's globalised and inter-connected world where spreading falsehood and entrapping many into the slavery of the devil is common. The explosion of the information age has provided opportunities for everyone to spread their opinions; be they misguided or otherwise. We marvel at the sophisticated techniques of propagating lies and disseminating rumours while witnessing modern media machinery's strong grasp on our thought process. We hope this work will con tin ue to become a source of enlightenment, just as it was envisaged over eight hundred years ago when it was penned.Ta/bis lb/is is an accessible work for everyone, and its value is in the knowledge it brings forth of various ideologies thereby increasing our own understanding of them - especially in today's globalised and inter-connected world where spreading falsehood and entrapping many into the slavery of the devil is common. The explosion of the information age has provided opportunities for everyone to spread their opinions; be they misguided or otherwise. We marvel at the sophisticated techniques of propagating lies and disseminating rumours while witnessing modern media machinery's strong grasp on our thought process. We hope this work will con tin ue to become a source of enlightenment, just as it was envisaged over eight hundred years ago when it was penned.Ta/bis lb/is is an accessible work for everyone, and its value is in the knowledge it brings forth of various ideologies thereby increasing our own understanding of them - especially in today's globalised and inter-connected world where spreading falsehood and entrapping many into the slavery of the devil is common. The explosion of the information age has provided opportunities for everyone to spread their opinions; be they misguided or otherwise. We marvel at the sophisticated techniques of propagating lies and disseminating rumours while witnessing modern media machinery's strong grasp on our thought process. We hope this work will con tin ue to become a source of enlightenment, just as it was envisaged over eight hundred years ago when it was penned.",
                "page_content": page_content,
                "page_no": i,
                "book_id": book_id,
                "ocr_text": ocr_text,
                # "ocr_text": "table is is an accessible work for everyone, and its value is in the knowledge it brings forth of various ideologies thereby increasing our own understanding of them - especially in today's globalised and inter-connected world where spreading falsehood and entrapping many into the slavery of the devil is common. The explosion of the information age has provided opportunities for everyone to spread their opinions; be they misguided or otherwise. We marvel at the sophisticated techniques of propagating lies and disseminating rumours while witnessing modern media machinery's strong grasp on our thought process. We hope this work will con tin ue to become a source of enlightenment, just as it was envisaged over eight hundred years ago when it was penned.Ta/bis lb/is is an accessible work for everyone, and its value is in the knowledge it brings forth of various ideologies thereby increasing our own understanding of them - especially in today's globalised and inter-connected world where spreading falsehood and entrapping many into the slavery of the devil is common. The explosion of the information age has provided opportunities for everyone to spread their opinions; be they misguided or otherwise. We marvel at the sophisticated techniques of propagating lies and disseminating rumours while witnessing modern media machinery's strong grasp on our thought process. We hope this work will con tin ue to become a source of enlightenment, just as it was envisaged over eight hundred years ago when it was penned.Ta/bis lb/is is an accessible work for everyone, and its value is in the knowledge it brings forth of various ideologies thereby increasing our own understanding of them - especially in today's globalised and inter-connected world where spreading falsehood and entrapping many into the slavery of the devil is common. The explosion of the information age has provided opportunities for everyone to spread their opinions; be they misguided or otherwise. We marvel at the sophisticated techniques of propagating lies and disseminating rumours while witnessing modern media machinery's strong grasp on our thought process. We hope this work will con tin ue to become a source of enlightenment, just as it was envisaged over eight hundred years ago when it was penned.",
                "images": xrefs,
                # "images": [
                #     "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617072418i/57423646.jpg",
                #     "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617072418i/57423646.jpg",
                #     "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617072418i/57423646.jpg"
                # ],
                "page_image": f"http://localhost:5500/book/image/{i}"
            })

        return res

    def get_login(self):
        self.update()
        res = self.json_data['login']
        print(res)
        return res

    def get_settings(self):
        self.update()
        res = self.json_data['settings']
        print(res)
        return res

    def read_json_file(self, file_path):
        try:
            with open(file_path, 'r') as file:
                data = json.load(file)
                return data
        except FileNotFoundError:
            print(f"Oops! Couldn't find the file at {file_path}. Check the path and try again.")
        except json.JSONDecodeError:
            print(f"Oops! Something went wrong decoding JSON in {file_path}. Double-check your JSON syntax.")

    def update(self):
        file_path = 'src/test.json'
        self.json_data = self.read_json_file(file_path)

    def __init__(self):
        self.update()
        self.pdfScan = PDFScan(database=None, book_dir="/data")
