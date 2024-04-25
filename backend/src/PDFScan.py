import pprint
import tempfile
import fitz
import pytesseract
from PIL import Image, UnidentifiedImageError
import re
import requests
import os


class PDFScan:
    @staticmethod
    def query_google_book(query):
        print(f"searching google book: {query}")
        api_end_point = "https://www.googleapis.com/books/v1/volumes"
        params = {'maxResults': 1, "printType": "books", "q": query}
        res = requests.get(url=api_end_point, params=params)

        if res.status_code == 200:
            data = res.json()
            # print(f"res: {data}")
            books = data.get("items", None)
            if not books:
                return None
            if len(books) > 0:
                book = books[0]
                book_metadata = {
                    "title": book.get("volumeInfo", {}).get("title", ""),
                    "authors": book.get("volumeInfo", {}).get("authors", []),
                    "description": book.get("volumeInfo", {}).get("description", ""),
                    "subtitle": book.get("volumeInfo", {}).get("subtitle", ""),
                    "publisher": book.get("volumeInfo", {}).get("publisher", ""),
                    "publishedDate": book.get("publishedDate", ""),
                    "lang": book.get("volumeInfo", {}).get("language", ""),
                    "maturityRating": book.get("volumeInfo", {}).get("maturityRating", ""),
                    "thumbnail": book.get("volumeInfo", {}).get("imageLinks", {}).get("thumbnail", ""),
                    "smallThumbnail": book.get("volumeInfo", {}).get("imageLinks", {}).get("smallThumbnail", ""),
                    "categories": book.get("volumeInfo", {}).get("categories", []),
                    "pageCount": book.get("volumeInfo", {}).get("pageCount", 0)
                }
                return book_metadata
            else:
                return None
        else:
            print(f"Failed to fetch data from API. Status code: {res.status_code}")
            return None

    @staticmethod
    def get_book_title(pdf_path):
        pdf = fitz.open(pdf_path)
        title = pdf.metadata['title']
        print("pdf_path", pdf_path)
        pprint.pprint(pdf.metadata)
        if title:
            return title
        else:
            file_name = os.path.splitext(os.path.basename(pdf_path))[0]
            return file_name

    @staticmethod
    def get_chapters(pdf_path):
        pdf_file = fitz.open(pdf_path)
        doc_outline = pdf_file.get_toc()
        outlines = []

        if len(doc_outline) > 0:
            for level, title, page_no in doc_outline:
                outlines.append({
                    "level": level, "title": title, "page_no": page_no
                })
        pdf_file.close()

        return outlines

    @staticmethod
    def get_total_pages(pdf_path):
        try:
            doc = fitz.open(pdf_path)
            total_pages = doc.page_count
            doc.close()
            return total_pages
        except Exception as e:
            print("total page", e)
            return 0

    def get_page_api_response(self, book_id, pdf_path, page_no, total_page, limit=10):
        res = []
        new_limit = limit if page_no + limit < total_page else total_page - page_no
        start = page_no
        end = page_no + new_limit
        print(f"start: {start}, end:{end}, limit {new_limit}")

        for i in range(start, end):
            xrefs = self.get_image_xrefs(pdf_path=pdf_path, page_num=i, book_id=book_id)
            # ocr_text = self.pdfScan.get_ocr_text(pdf_path="src/behave.pdf", page_num=i)
            ocr_text = ""
            page_content = self.get_page_text(pdf_path=pdf_path, page_num=i)

            res.append({
                "page_content": page_content,
                "page_no": i,
                "book_id": book_id,
                "ocr_text": ocr_text,
                "images": xrefs,
                "page_image": f"/book/image/{book_id}/{i}"
            })

        return res

    @staticmethod
    def get_image_xrefs(pdf_path, page_num, book_id):
        pdf_file = fitz.open(pdf_path)
        page = pdf_file[page_num]
        images = page.get_images()

        xrefs = []
        for i, image in enumerate(images):
            xref = image[0]  # XREF number of the image
            # xrefs.append(f"/book/xref/{xref}")
            xrefs.append(f"http://localhost:5500/book/xref/{book_id}/{xref}")

        return xrefs

    def get_ocr_text(self, pdf_path, page_num):
        pdf_file = fitz.open(pdf_path)
        pdf_page = pdf_file[int(page_num)]
        pixmap = pdf_page.get_pixmap(dpi=self.page_dpi)
        image_text = ""
        with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp_file:
            pixmap.save(tmp_file.name)
            try:
                with Image.open(tmp_file.name) as img:
                    # # # Check if the image is in landscape orientation
                    # if img.height != image_height and img.width != image_width:
                    #     # Rotate the image by 90 degrees if it is in portrait orientation
                    #     img = img.rotate(-90, expand=True)
                    # image_text = pytesseract.image_to_string(image=img, lang=self.LANG)
                    image_text = pytesseract.image_to_string(image=img)
                    tmp_file.close()
            except UnidentifiedImageError:
                print("UnidentifiedImageError Image")
            finally:
                tmp_file.close()
        return image_text

    def get_page_text(self, pdf_path, page_num):
        pdf_file = fitz.open(pdf_path)
        pdf_page = pdf_file[int(page_num)]
        text = pdf_page.get_text("text").encode("utf8")
        text = self.remove_unrecognized_chars(text).decode("utf8")

        return str(text)

    @staticmethod
    def remove_unrecognized_chars(text):
        # Convert bytes to a UTF-8 string
        decoded_text = text.decode("utf-8")
        # Use a regular expression to filter out unrecognized and invalid characters
        cleaned_text = re.sub(r'[^\x00-\x7F]', ' ', decoded_text)
        # Encode the cleaned string back to bytes
        cleaned_bytes = cleaned_text.encode("utf-8")
        return cleaned_bytes

    def get_image_from_xref(self, pdf_path, xref):
        pdf_file = fitz.open(pdf_path)
        pixmap = fitz.Pixmap(pdf_file, int(xref))
        image = self.convert_pixmap_to_image_binary(pixmap)
        return image

    def get_page_image(self, pdf_path, page_num, is_thumb=True):
        pdf_file = fitz.open(pdf_path)
        pdf_page = pdf_file[int(page_num)]
        if is_thumb:
            pixmap = pdf_page.get_pixmap(dpi=self.thumb_dpi)
        else:
            pixmap = pdf_page.get_pixmap(dpi=self.page_dpi)
        image_binary = self.convert_pixmap_to_image_binary(pixmap)
        return image_binary

    @staticmethod
    def convert_pixmap_to_image_binary(pixmap):
        # Create a temporary file-like object to store the image data
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
            # Save the Pixmap to the temporary file in PNG format
            pixmap.save(tmp_file.name)

        # Read the binary data from the temporary file
        with open(tmp_file.name, 'rb') as image_file:
            image_binary = image_file.read()
            tmp_file.close()
        return image_binary

    def __init__(self, book_dir="/data", lang="en+ben"):
        self.BOOK_DIR = book_dir
        self.LANG = lang
        # other vars
        self.page_dpi = 300
        self.thumb_dpi = 50
