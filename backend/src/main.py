import os
from flask import Flask, Response
from flask_cors import CORS
from flask import request
import logging
from DirWatcher import DirWatcher
from database import DB
from Scan import Scanner
from PDFScan import PDFScan

# Settings___________________________________________________________
PORT = os.getenv(key='PORT', default=5500)

username = os.getenv(key='USER_NAME', default="demouser")
password = os.getenv(key='USER_PASSWORD', default="demouser")
book_dir = os.getenv(key='BOOK_DIR', default="./data")

# Flask App setup____________________________________________________
app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)
cors = CORS(app, origins="*")

# hosts
BACKEND_HOST = os.getenv(key='BACKEND_HOST', default="http://localhost:5500")
FRONTEND_HOST = os.getenv(key='FRONTEND_HOST', default="http://localhost:3000")

# database setup
DB_USERNAME = os.getenv(key='DB_USERNAME', default="root")
DB_PASSWORD = os.getenv(key='DB_PASSWORD', default="example")
DB_HOST = os.getenv(key='DB_HOST', default='localhost')
DB_PORT = os.getenv(key='DB_PORT', default='27018')
db = DB(username=DB_USERNAME, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)

scanner = Scanner()
pdfScan = PDFScan(db, book_dir)

dirWatcher = DirWatcher(book_dir, BACKEND_HOST, db)


# End Points_________________________________________________________
# list of books
@app.route('/books', methods=["POST"])
def books():
    data = request.get_json()
    start_book_id = data.get("start_book_id", None)
    limit = data.get("limit", 1000)
    user_id = data.get("user_id", None)
    res = db.get_books(start_book_id=start_book_id, user_id=user_id, limit=limit)

    return res


# book information with user config
@app.route('/book/<book_id>', methods=["POST"])
def book(book_id):
    data = request.get_json()
    user_id = data.get("user_id", None)
    print(f"book id :{book_id}, uid: {user_id}")
    res = db.get_book_with_settings(book_id=book_id, user_id=user_id)
    return res


# pages
@app.route('/book/<book_id>/<page_no>', methods=["POST"])
def pages(book_id, page_no):
    data = request.get_json()
    limit = data.get("limit", 10)
    filter_book = db.get_book(book_id=book_id)
    total_page = filter_book.get("page_no", 0)
    pdf_path = filter_book.get("path", None)

    if pdf_path:
        res = pdfScan.get_page_api_response(
            book_id=book_id, pdf_path=pdf_path,
            page_no=int(page_no),
            total_page=int(total_page), limit=int(limit))
        return res
    else:
        return None


# pages image
@app.route('/book/image/<book_id>/<page_no>', methods=["GET"])
@app.route('/book/image/<book_id>/<page_no>/<is_thumb>', methods=["GET"])
def page_image(book_id, page_no, is_thumb=None):
    filter_book = db.get_book(book_id=book_id)
    if not filter_book:
        return "no image"
    path = filter_book.get("path", None)
    if path:
        if is_thumb == "t":
            image = pdfScan.get_page_image(pdf_path=path,
                                           page_num=page_no,
                                           is_thumb=True)
        else:
            image = pdfScan.get_page_image(pdf_path=path,
                                           page_num=page_no,
                                           is_thumb=False)
        if image is not None:
            response = Response(image, mimetype='image/png')
            response.headers['Cache-Control'] = 'max-age=86400'
            return response
    else:
        return "Image not found"


# images inside page
@app.route('/book/xref/<xref>', methods=["GET"])
def images_inside_page(xref):
    image = pdfScan.get_image_from_xref(
        pdf_path="src/behave.pdf",
        xref=xref)
    if image is not None:
        response = Response(image, mimetype='image/png')
        response.headers['Cache-Control'] = 'max-age=86400'
        return response
    else:
        return "Image not found"


# create user
@app.route('/signin', methods=["POST"])
def sign_in():
    data = request.get_json()
    username = data.get("username", None)
    password = data.get("password", None)

    res = db.create_user(username, password)
    if res:
        return {"uid": res}
    else:
        return {"uid": False}


# login
@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", None)
    password = data.get("password", None)

    res = db.get_user(username, password)
    if res:
        return res
    else:
        return {"_id": False}


# user settings
@app.route('/user', methods=["POST"])
def user_settings():
    data = request.get_json()
    user_id = data.get("user_id", None)
    # res = db.get_user(user_id)
    res = scanner.get_settings()

    return res


@app.route('/deleteAllBooks', methods=["POST"])
def delete_books():
    res = db.remove_all_books()
    return {"res": res}


@app.route('/deleteAllUsers', methods=["POST"])
def delete_users():
    res = db.remove_all_users()
    return {"res": res}


@app.route('/test', methods=["POST"])
def test():
    return {"res": "test response"}


# settings _______________________________________________
# save user progress
@app.route('/user/progress', methods=["POST"])
def set_progress():
    data = request.get_json()
    user_id = data.get("user_id", None)
    book_id = data.get("book_id", None)
    progress = data.get("progress", 1)
    res = db.set_progress(user_id, book_id, progress)
    return {"res": res}


if __name__ == '__main__':
    new_user = db.create_user(username, password)
    app.run(debug=True, host='0.0.0.0', port=PORT, threaded=True)
