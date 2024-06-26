from datetime import datetime
from pymongo import MongoClient, ReturnDocument
from bson import ObjectId
from bson.json_util import dumps
import pprint
from PDFScan import PDFScan


class DB:
    def insert_book_(self, filename, path, page_no, book_title, chapters):
        filter_book = {"path": str(path)}
        book_id = ObjectId()

        res = self.books.update_one(
            filter_book,
            {"$setOnInsert": {
                "_id": book_id,
                "path": path,
                "filename": filename,
                "page_no": page_no,
                "insert_time": datetime.now(),
                "processing": 0,
                "chapters": chapters
            }
            }, upsert=True)
        print(res)

        if not res.raw_result.get("updatedExisting"):
            google_book = self.pdf_scan.query_google_book(book_title)
            print(f"update google info:{google_book}")
            self.books.update_one(
                filter_book,
                {"$set": {"google_info": google_book}
                 }, upsert=False)

    def get_books_(self, start_book_id=None, user_id=None, limit=None):
        pipline = []
        if start_book_id:
            pipline.append({
                "$match": {
                    "_id": {"$gt": ObjectId(start_book_id)},
                },
            })

        if limit:
            pipline.append({
                '$limit': limit
            })

        pipline.extend([
            {
                '$addFields': {
                    'id': {
                        '$toString': '$_id'
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'user_settings',
                    'let': {
                        'bookIdString': '$id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$book_id', '$$bookIdString'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$user_id', user_id
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'settings'
                }
            },
        ])

        books = self.books.aggregate(pipline)
        count = self.books.count_documents({})
        return dumps({"books": books, "count": count})

    # old code _____________________
    def insert_book(self, name, description, page_no, path, google_book=None):
        book_id = ObjectId()
        filter_book = {"path": str(path)}
        if google_book.get("thumbnail"):
            cover = f"/book/image/{str(book_id)}/0"
        else:
            cover = google_book.get("thumbnail")

        self.books.update_one(
            filter_book,
            {"$setOnInsert": {
                "_id": book_id,
                "path": path,
                "name": name,
                "description": description,
                "page_no": page_no,
                "insert_time": datetime.now(),
                # "cover": f"/book/image/{str(book_id)}/0",
                "cover": cover,
                "processing": 100,

            }
            }, upsert=True)

    def delete_book(self, book_id):
        print("delete book", book_id)
        delete_book = self.books.delete_one({"_id": ObjectId(book_id)})
        res = self.user_settings.delete_many({"book_id": str(book_id)})
        res = self.bookmarks.delete_many({"book_id": str(book_id)})

    def delete_by_path(self, book_path):
        print("delete book by path", book_path)
        book = self.get_book_by_path(book_path)
        book_id = book.get("_id",None)

        if book_id:
            self.delete_book(book_id)

    def update_book_by_object(self, filter_object, updated_object):
        res = self.books.update_one(filter_object, {"$set": updated_object})
        return str(res.upserted_id)

    def update_book(self, name, description, page_no, cover, progress, path):
        filter_obj = {"path": path}
        res = self.books.update_one(filter_obj, {
            "name": name, "description": description, "page_no": page_no,
            "cover": cover, "progress": progress, "path": path
        })
        return str(res.upserted_id)

    def get_books_count(self):
        c = self.books.count_documents({})
        return c

    def get_raw_books(self):
        res = self.books.find({})
        return res

    def get_books(self, start_book_id=None, user_id=None, limit=None):
        pipline = []
        if start_book_id:
            pipline.append({
                "$match": {
                    "_id": {"$gt": ObjectId(start_book_id)},
                },
            })

        if limit:
            pipline.append({
                '$limit': limit
            })

        pipline.extend([
            {
                '$addFields': {
                    'id': {
                        '$toString': '$_id'
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'user_settings',
                    'let': {
                        'bookIdString': '$id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$book_id', '$$bookIdString'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$user_id', user_id
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'settings'
                }
            },
        ])

        books = self.books.aggregate(pipline)
        count = self.books.count_documents({})
        return dumps({"books": books, "count": count})

    def get_currently_read_books(self, user_id=None, limit=20, last_id=None):
        pipline = []
        if last_id:
            pipline.append({
                "$match": {
                    "_id": {"$gt": ObjectId(last_id)},
                },
            })
        pipline.extend([
            {
                '$match': {
                    'user_id': user_id
                }
            },
            {
                '$sort': {
                    "update_time": -1
                }
            },
            {
                '$limit': limit
            },
            {
                '$lookup': {
                    'from': 'books',
                    'let': {
                        'settings_book_id': '$book_id'
                    },
                    'pipeline': [
                        {
                            '$addFields': {
                                'id': {
                                    '$toString': '$_id'
                                }
                            }
                        }, {
                            '$match': {
                                '$expr': {
                                    '$eq': [
                                        '$id', '$$settings_book_id'
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'result'
                }
            }
        ])
        books = self.user_settings.aggregate(pipline)
        return dumps(books)

    def get_processing_read_books(self, limit=20, last_id=None):
        pipline = []
        if last_id:
            pipline.append({
                "$match": {
                    "_id": {"$gt": ObjectId(last_id)},
                },
            })

        if limit:
            pipline.append({
                '$limit': limit
            })

        pipline.extend([
            {
                '$match': {
                    "processing": {"$gt": 0},
                }
            }
        ])

        books = self.books.aggregate(pipline)
        return dumps(books)

    def get_book(self, book_id):
        book = self.books.find_one({"_id": ObjectId(book_id)})
        print("get book", book)
        return book

    def get_book_by_path(self, book_path):
        book = self.books.find_one({"path": book_path})
        print("get book by path", book_path)
        print("get book by path res", book)
        return book

    # Bookmarks settings ____________________________________________________________
    def set_bookmark(self, user_id, book_id, page_no, text):
        filter_obj = {"user_id": user_id, "book_id": book_id, "page_no": page_no}
        res = self.bookmarks.update_one(filter_obj, {"$set": {
            "user_id": user_id, "book_id": book_id, "page_no": page_no,
            "text": text, "update_time": datetime.now()
        }}, upsert=True)
        print("set bookmark", res)
        return str(res.upserted_id)

    def delete_bookmark(self, user_id, book_id, page_no):
        filter_obj = {"user_id": user_id, "book_id": book_id, "page_no": page_no}
        res = self.bookmarks.delete_one(filter_obj)
        print("delete bookmark", res)
        if res.deleted_count == 1:
            return True
        else:
            return False

    def get_bookmarks_by_books(self, user_id, book_id):
        bookmarks = self.bookmarks.aggregate([
            {
                '$match': {
                    'user_id': user_id,
                    'book_id': book_id
                }
            },
            {
                '$lookup': {
                    'from': 'books',
                    'let': {
                        'bookIdString': '$book_id'
                    },
                    'pipeline': [
                        {
                            '$addFields': {
                                'id': {
                                    '$toString': '$_id'
                                }
                            }
                        }, {
                            '$match': {
                                '$expr': {
                                    '$eq': [
                                        '$id', '$$bookIdString'
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'book_info'
                }
            }
        ])
        return dumps(bookmarks)

    def get_all_bookmarks(self, user_id, limit=20, last_id=None):
        pipline = []
        if last_id:
            pipline.append({
                "$match": {
                    "_id": {"$gt": ObjectId(last_id)},
                },
            })
        pipline.extend([
            {
                '$sort': {
                    "update_time": -1
                }
            },
            {
                '$match': {
                    'user_id': user_id
                }
            },
            {
                '$limit': limit
            },
            {
                '$lookup': {
                    'from': 'books',
                    'let': {
                        'bookIdString': '$book_id'
                    },
                    'pipeline': [
                        {
                            '$addFields': {
                                'id': {
                                    '$toString': '$_id'
                                }
                            }
                        }, {
                            '$match': {
                                '$expr': {
                                    '$eq': [
                                        '$id', '$$bookIdString'
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'book_info'
                }
            }
        ])
        bookmarks = self.bookmarks.aggregate(pipline)
        return dumps(bookmarks)

    def query_bookmarks(self, user_id, query, limit):
        bookmarks = self.bookmarks \
            .find(
            {
                "text": {'$regex': query, '$options': 'i'},
                "user_id": user_id
            }) \
            .limit(limit)
        return dumps(bookmarks)

    # ___________________________________________________________________________________

    def get_book_with_settings(self, book_id, user_id):
        if not (book_id and user_id):
            return {}
        book = self.books.aggregate([
            {
                '$match': {
                    '_id': ObjectId(book_id)
                }
            },
            {
                '$addFields': {
                    'id': {
                        '$toString': '$_id'
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'user_settings',
                    'let': {
                        'bookIdString': '$id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$book_id', '$$bookIdString'
                                            ]
                                        }, {
                                            '$eq': [
                                                '$user_id', user_id
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'settings'
                }
            },
            {
                '$project': {"_id": 0}
            }
        ])

        return dumps(book)

    def query_on_book_name(self, query, limit):
        books = self.books.find({"name": {'$regex': query, '$options': 'i'}}) \
            .limit(limit)

        return dumps(books)

    def update_page(self, book_id, page_no, page_content):
        if page_no:
            filter_id = {book_id: book_id, page_no: page_no}

            res = self.pages.update_one(filter_id, {
                book_id: book_id, page_content: page_content, page_no: page_no
            })
        else:
            res = self.pages.insert_one({
                book_id: book_id, page_content: page_content, page_no: page_no
            })
        return res

    def get_page(self, book_id, page_no):
        filter_id = {book_id: book_id, page_no: page_no}
        books = self.books.find_one(filter_id)
        return books

    def update_user(self, user_id, username, password):
        if user_id:
            res = self.users.update_one({user_id: user_id}, {
                username: username, password: password
            })
        else:
            res = self.users.insert_one({
                username: username, password: password
            })
        return res

    def create_user(self, username, password, is_admin=False):
        check_old_users = self.get_user(username, password)
        if not check_old_users:
            try:
                if is_admin:
                    print("create admin user")
                    res = self.users.insert_one({
                        "username": username,
                        "password": password,
                        "is_admin": True

                    })
                else:
                    print("create regular user")
                    res = self.users.insert_one({
                        "username": username,
                        "password": password,
                        "is_admin": False
                    })
                return str(res.inserted_id)
            except Exception as e:
                print(e)

        return None

    def delete_user(self, user_id):
        print("user delete", user_id)
        res = self.users.delete_one({"_id": ObjectId(user_id)})
        return dumps(res.deleted_count)
        # return dumps(res)

    def get_user(self, username, password):
        res = self.users.find_one({
            "username": username,
            "password": password
        })

        if res:
            return dumps(res)
        else:
            return None

    def get_user_by_id(self, id):
        res = self.users.find_one({"_id": ObjectId(id)})
        return res

    def get_users(self):
        # res = self.users.find({}, {"password": 0})
        res = self.users.find({})
        return dumps(res)

    def remove_all_books(self):
        res_books = self.books.delete_many({})
        res_pages = self.pages.delete_many({})
        return [res_books, res_pages]

    def remove_all_users(self):
        res = self.users.delete_many({})
        return res

    def remove_all_user_settings(self):
        res = self.user_settings.delete_many({})
        return res

    def remove_all_bookmarks(self):
        res = self.bookmarks.delete_many({})
        return res

    def set_progress(self, user_id, book_id, progress):
        filter_object = {"user_id": user_id, "book_id": book_id}
        res = self.user_settings.find_one_and_update(
            filter_object, {"$set": {
                "progress": progress,
                "update_time": datetime.now()
            }}, upsert=True, return_document=ReturnDocument.AFTER
        )

        if res:
            print("set progress", str(res.get("_id")))
            return str(res.get("_id"))
        else:
            print("set progress", False)
            return False

    def __init__(self,
                 pdf_scan: PDFScan,
                 username='root',
                 password='example',
                 host='localhost',
                 port='27017',
                 auth_source='admin'):

        self.pdf_scan = pdf_scan
        connection_string = f"mongodb://{username}:{password}@{host}:{port}/{auth_source}"
        client = MongoClient(connection_string)
        db = client['reader']
        self.books = db['books']
        self.pages = db['pages']
        self.users = db['users']
        self.user_settings = db['user_settings']
        self.bookmarks = db['bookmarks']
        info = client.server_info()
        pprint.pprint(info)
