import os
from flask import Flask, Response
from flask_cors import CORS
from flask import request

PORT = os.getenv(key='PORT', default=5500)

username = os.getenv(key='USER_NAME', default="demouser")
password = os.getenv(key='USER_PASSWORD', default="demouser")
book_dir = os.getenv(key='BOOK_DIR', default="./data")

# Flask App setup____________________________________________________
app = Flask(__name__)
cors = CORS(app, origins="*")

# hosts
BACKEND_HOST = os.getenv(key='BACKEND_HOST', default="http://localhost:5500")
FRONTEND_HOST = os.getenv(key='FRONTEND_HOST', default="http://localhost:3000")


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

    res = {
        "output": "done"
    }
    return res


if __name__ == '__main__':
    app.run(use_reloader=False, debug=True, host='0.0.0.0', port=PORT, threaded=True)
