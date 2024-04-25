import os
from flask import Flask, Response
from flask_cors import CORS
from flask import request
from database import DB
from PDFScan import PDFScan
from DirWatcher import DirWatcher
from dotenv import load_dotenv

load_dotenv()
PORT = os.getenv(key='PORT', default=5500)
username = os.getenv(key='USER_NAME', default="demouser")
password = os.getenv(key='USER_PASSWORD', default="demouser")
book_dir = os.getenv(key='BOOK_DIR', default="./Books/")
print(f"book dir: {book_dir}")
# Flask App setup____________________________________________________
app = Flask(__name__)
cors = CORS(app, origins="*")

# get env from docker
# hosts
BACKEND_HOST = os.getenv(key='BACKEND_HOST', default="http://localhost:5500")
FRONTEND_HOST = os.getenv(key='FRONTEND_HOST', default="http://localhost:3000")
# database
DB_USERNAME = os.getenv(key='DB_USERNAME', default="root")
DB_PASSWORD = os.getenv(key='DB_PASSWORD', default="example")
DB_HOST = os.getenv(key='DB_HOST', default='localhost')
DB_PORT = os.getenv(key='DB_PORT', default='27018')

# database setup
pdf_scan = PDFScan(book_dir)
db = DB(pdf_scan, username=DB_USERNAME, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
dirWatcher = DirWatcher(book_dir, BACKEND_HOST, db, pdf_scan)


# requests____________________________________________________
@app.route('/test', methods=["GET"])
def test():
    res = {
        "output": "done"
    }
    return res


@app.route('/books', methods=["POST"])
def books():
    data = request.get_json()
    start_book_id = data.get("start_book_id", None)
    limit = data.get("limit", 20)
    user_id = data.get("user_id", None)
    res = db.get_books(start_book_id=start_book_id, user_id=user_id, limit=limit)
    # Create a Response object with JSON data and content type
    response = Response(response=res, status=200, mimetype="application/json")
    return response


if __name__ == '__main__':
    app.run(use_reloader=True, debug=True, host='0.0.0.0', port=PORT, threaded=True)
