import os
import tempfile
from io import BytesIO
import pytesseract
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from datetime import datetime
import glob
import fitz
import database
# from src.app.database import Database
from PIL import Image, UnidentifiedImageError, ImageOps
import re


class PDFProcessing:
    BOOK_DIR = "/books"
    IMAGE_DIR = "/images"
    LANG = "eng+ben"

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
        observer.schedule(event_handler, path=self.BOOK_DIR)
        observer.start()
        # print("watch do started")

    @staticmethod
    def get_unfinished(rows):
        unfinished = []
        for row in rows:
            processing = row[5]
            total_page = row[6]
            loc = row[2]
            if (processing + 1) != total_page:
                unfinished.append(loc)

        return unfinished

    def scan_dir(self):
        files = glob.glob(self.BOOK_DIR + '/*.pdf')
        files_in_database = self.db.get_all_pdfs()
        locations_in_database = [loc[2] for loc in files_in_database]

        # check if anything new
        for file_location in files:
            # check if any file is not listed in database list
            if not locations_in_database or file_location not in locations_in_database:
                file_name = os.path.splitext(os.path.basename(file_location))[0]
                total_page = self.get_total_pages(file_location)

                print(f"scan: {file_name}, location: {file_location}, pages: {total_page}")
                pdf_id = self.db.add_pdf(name=file_name, location=file_location, total_page=total_page)
                # add a book cover and outlines
                if pdf_id >= 0:
                    self.update_book_cover_and_outline(pdf_id=pdf_id, pdf_path=file_location)

        # check if anything removed
        location_with_id_in_database = [[loc[0], loc[2]] for loc in files_in_database]
        for pdf_id, file_location in location_with_id_in_database:
            if file_location not in files:
                self.db.remove_pdf(pdf_id)
                self.remove_cover(pdf_id)
                print(f"removed: {file_location}")

    def remove_cover(self, pdf_id):
        image_path = os.path.join(self.IMAGE_DIR, f"{pdf_id}.png")
        if os.path.isfile(image_path):
            os.remove(image_path)

    def scan_files_from_database(self):
        all_files = self.db.get_all_pdfs()
        print(f"starting scan file: {all_files}")

        for row in all_files:
            file_id = row[0]
            file_location = row[2]
            file_name = row[1]
            total_page = row[6]
            last_processed_page = row[5]

            print(f"start scan file id: {file_id}, location:{file_location}")

            if total_page > (last_processed_page + 1):
                start_page = last_processed_page + 1
                # self.scan_pdf(file_location, file_id, file_name, start_page)
                self.scan_pdf_file(file_location, file_id, start_page)
            else:
                print("already scan")

        print("scan complete")

    def update_book_cover_and_outline(self, pdf_id, pdf_path):
        pdf_file = fitz.open(pdf_path)

        # set cover
        cover_path = os.path.join(self.IMAGE_DIR, f"{pdf_id}.png")
        if os.path.exists(cover_path):
            print("cover already exist")
        else:
            print("extract cover pic")
            first_page = pdf_file[0]
            pixmap = first_page.get_pixmap(dpi=300)
            pixmap.save(cover_path)

        # set outlines
        doc_outline = pdf_file.get_toc()
        outlines = []

        if len(doc_outline) > 0:
            for level, title, page_no in doc_outline:
                outlines.append((pdf_id, level, title, page_no))

            self.db.add_outline(outlines)

        pdf_file.close()

    @staticmethod
    def fix_nonbreaking_spaces(text):
        # Replace "C2 A0" (non-breaking space) with regular space " "
        fixed_text = text.replace(b'\xc2\xa0\x38\xef', b' ')
        return fixed_text

    # @staticmethod
    # def remove_unrecognized_chars(text):
    #     # Use a regular expression to filter out unrecognized and invalid characters
    #     cleaned_text = re.sub(r'[^\x00-\x7F]', '', text)
    #     return cleaned_text

    @staticmethod
    def remove_unrecognized_chars(text):
        # Convert bytes to a UTF-8 string
        decoded_text = text.decode("utf-8")
        # Use a regular expression to filter out unrecognized and invalid characters
        cleaned_text = re.sub(r'[^\x00-\x7F]', ' ', decoded_text)
        # Encode the cleaned string back to bytes
        cleaned_bytes = cleaned_text.encode("utf-8")
        return cleaned_bytes

    def scan_pdf_file(self, pdf_path, pdf_id, start_page):
        pdf_file = fitz.open(pdf_path)
        total_pages = pdf_file.page_count

        for page_num in range(start_page, total_pages):
            page = pdf_file[page_num]

            # extract pdf text
            text = page.get_text("text").encode("utf8")
            text = self.remove_unrecognized_chars(text)
            print(f"pdf text: {text}")

            # image processing
            images = page.get_images()
            image_ocr_texts = []

            for i, image in enumerate(images):
                xref = image[0]  # XREF number of the image

                pixmap = fitz.Pixmap(pdf_file, xref)

                # base_image = pdf_file.extract_image(xref)
                # image_bytes = base_image["image"]
                # image_ext = base_image["ext"]
                # image_height = base_image["height"]
                # image_width = base_image["width"]

                with tempfile.NamedTemporaryFile(suffix=".png", delete=True) as tmp_file:
                    pixmap.save(tmp_file.name)

                    try:
                        with Image.open(tmp_file.name) as img:
                            # # # Check if the image is in landscape orientation
                            # if img.height != image_height and img.width != image_width:
                            #     # Rotate the image by 90 degrees if it is in portrait orientation
                            #     img = img.rotate(-90, expand=True)

                            image_text = pytesseract.image_to_string(img)
                            print(f"image text: {image_text}")
                            image_ocr_texts.append({"ocr_text": image_text, "xref": xref})

                            tmp_file.close()
                    except UnidentifiedImageError:
                        print("UnidentifiedImageError Image")
                        self.db.put_page_image_text(pdf_id, page_num, " ", xref)
                    finally:
                        tmp_file.close()

            # check if blank page
            if not text and not len(image_ocr_texts) > 0:
                self.db.put_page_text(pdf_id, page_num, " ")
            else:
                self.db.put_page_text(pdf_id, page_num, text)
                for ocr in image_ocr_texts:
                    self.db.put_page_image_text(pdf_id, page_num, ocr["ocr_text"], ocr["xref"])

            self.db.update_scan_process(pdf_id, page_num)

        pdf_file.close()

    def get_page_image(self, pdf_id, xref):
        pdf_path = self.db.get_pdf_location(pdf_id)
        if pdf_path:
            pdf_path = pdf_path[0]
            pdf_file = fitz.open(pdf_path)
            image_binary = self.get_xref_image(pdf_file, xref)
            return image_binary
            # base_image = pdf_file.extract_image(xref)
            #
            # if base_image is not None:
            #     image_bytes = base_image["image"]
            #     image_height = base_image["height"]
            #     image_width = base_image["width"]
            #
            #     print(f"h: {image_height}, w: {image_width}")
            #     image_pil = Image.open(BytesIO(image_bytes))
            #     print(f"h2: {image_pil.height}, w2: {image_pil.width}")
            #     if image_pil.height != image_height and image_pil.width != image_width:
            #         # Rotate the image by 90 degrees if it is in portrait orientation
            #         image_pil = image_pil.rotate(-90, expand=True)
            #
            #     # Check if the image is in landscape orientation
            #     # if image_pil.height > image_pil.width:
            #     #     # Rotate the image by 90 degrees if it is in portrait orientation
            #     #     image_pil = image_pil.rotate(-90, expand=True)
            #     # Convert the Pillow image to bytes
            #     image_byte_array = BytesIO()
            #     image_pil.save(image_byte_array, format='PNG')
            #
            #     # Get the bytes
            #     image_bytes = image_byte_array.getvalue()
            #
            #     return image_bytes

        return None

    def get_cover(self, pdf_id):
        image_path = os.path.join(self.IMAGE_DIR, f"{pdf_id}.png")
        return image_path

    def get_xref_image(self, doc, xref):
        pixmap = fitz.Pixmap(doc, xref)

        with tempfile.NamedTemporaryFile(suffix=".png",delete=True) as tmp_file:
            pixmap.save(tmp_file.name)
            image_binary = tmp_file.read()
            print(f"binary: {image_binary}")
            tmp_file.close()

            return image_binary

    def convert_pdf_to_image(self, pdf_id, page_num):
        pdf_path = self.db.get_pdf_location(pdf_id)
        # print(f"pdf path: {pdf_path}")
        if pdf_path:
            pdf_path = pdf_path[0]
            pdf_file = fitz.open(pdf_path)
            pdf_page = pdf_file[page_num]
            # Get the pixmap for the page
            pixmap = pdf_page.get_pixmap(dpi=300)
            image_binary = self.convert_pixmap_to_image_binary(pixmap)
            return image_binary

        return None

    @staticmethod
    def convert_pixmap_to_image_binary(pixmap):
        # Create a temporary file-like object to store the image data
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_file:
            # print("saving image to tmp file")
            # Save the Pixmap to the temporary file in PNG format
            pixmap.save(tmp_file.name)

        # Read the binary data from the temporary file
        with open(tmp_file.name, 'rb') as image_file:
            # print("converting to binary")
            image_binary = image_file.read()
            tmp_file.close()

        return image_binary

    @staticmethod
    def get_total_pages(pdf_path):
        doc = fitz.open(pdf_path)
        total_pages = doc.page_count
        doc.close()
        return total_pages

    def get_database(self):
        return self.db

    def __init__(self):
        # self.db = Database()
        # self.schedule_watchdog_task()
        self.db = database.DB()
        self.re_database()

    def clear(self):
        # Remove database
        self.db.clear()

        # Remove all cover of books
        for filename in os.listdir(self.IMAGE_DIR):
            file_path = os.path.join(self.IMAGE_DIR, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"remove {file_path}")

        # remake database and table
        self.db = database.DB()

    def re_database(self):
        # Remove database
        self.db.clear()

        # Remove all cover of books
        for filename in os.listdir(self.IMAGE_DIR):
            file_path = os.path.join(self.IMAGE_DIR, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
                print(f"remove {file_path}")

        self.db = database.DB()

        # populate database
        self.scan_dir()
        self.scan_files_from_database()



