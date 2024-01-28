from pymongo import MongoClient
from bson import ObjectId
from bson.json_util import dumps
import pprint


class DB:
    def insert_book(self, name, description, page_no, cover, progress, path):
        res = self.books.insert_one({
            "name": name, "description": description, "page_no": page_no,
            "cover": cover, "progress": progress, "path": path
        })
        return str(res.inserted_id)

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

    def get_books(self, start_book_id=None, user_id=None, limit=20):
        books = self.books.aggregate([
            {
                '$limit': limit
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
                '$project': {
                    "_id": 0,
                    "settings": {"_id": 0}
                }
            }
        ])
        return list(books)

    def get_book(self, book_id):
        book = self.books.find_one({"_id": ObjectId(book_id)})
        print("book", book)
        return book

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
                    res = self.users.insert_one({
                        "username": username,
                        "password": password
                    })
                else:
                    res = self.users.insert_one({
                        "username": username,
                        "password": password,
                        "is_admin": True
                    })
                return str(res.inserted_id)
            except Exception as e:
                print(e)

        return None

    def get_user(self, username, password):
        res = self.users.find_one({
            "username": username,
            "password": password
        })
        print("get user", res)
        if res:
            return str(res.get("_id"))
        else:
            return None

    def remove_all_books(self):
        res_books = self.books.delete_many({})
        res_pages = self.pages.delete_many({})
        return [res_books, res_pages]

    def remove_all_users(self):
        res = self.users.delete_many({})
        return res

    def set_progress(self, user_id, book_id, progress):
        filter_object = {"user_id": user_id, "book_id": book_id}
        res = self.user_settings.update_one(
            filter_object, {"$set": {
                "progress": progress
            }}, upsert=True)
        if res:
            print("set progress", str(res.upserted_id))
            return str(res.upserted_id)
        else:
            print("set progress", False)
            return False

    def __init__(self, username='root',
                 password='example',
                 host='localhost',
                 port='27017',
                 auth_source='admin'):

        connection_string = f"mongodb://{username}:{password}@{host}:{port}/{auth_source}"
        client = MongoClient(connection_string)
        db = client['reader']
        self.books = db['books']
        self.pages = db['pages']
        self.users = db['users']
        self.user_settings = db['user_settings']
        info = client.server_info()
        pprint.pprint(info)

    # {
    # 	$lookup: {
    #     from: "user_settings",
    #     localField: {_id: ObjectId('65b37eeb3afc6d8875d5c6fb')},
    #     foreignField: "book_id",
    #     as: "result"
    # 	}
    # }
