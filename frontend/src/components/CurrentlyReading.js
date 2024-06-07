import { Button, Divider, Flex, Layout, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { getCurrentBooksFromBackend } from "../utils/backend";
import BookCard from "./home/BookCard";
import LoadingBookList from "./home/LoadingBookList";
import { AppContext } from "../utils/AppProvider";
import { ArrowDownOutlined } from "@ant-design/icons";


export default function CurrentlyReading() {
    const [bookList, setBookList] = useState([])
    const [loadingBooklist, setLoadingBooklist] = useState(true)
    const { uid } = useContext(AppContext)
    const bookCount = 100

    const loadMoreBooks = () => {
        setLoadingBooklist(true)
        let lastUid = null
        if (bookList.length > 0) {
            const lastBook = bookList[bookList.length - 1]
            if (lastBook) {
                lastUid = lastBook.book_id
            }
        }
        // library
        getCurrentBooksFromBackend(lastUid, uid, 100)
            .then(res => {

                console.log('c', res)

                if (res) setBookList([...bookList, ...res])
                setLoadingBooklist(false)

            })
            .catch(e => {
                setLoadingBooklist(false)
            })
    }

    useEffect(() => {
        loadMoreBooks()
    }, [])

    return (
        <Layout style={{ padding: "10px" }}>
            <Typography.Title level={2}>Currently Reading</Typography.Title>
            {loadingBooklist && <LoadingBookList />}
            <Space align="start" wrap>


                {!loadingBooklist && bookList.map((item, key) => {
                    if (item.result.length > 0) {
                        const book_info = item.result[0]

                        return <BookCard
                            id={item.book_id}
                            title={book_info.google_info.title ? book_info.google_info.title : book_info.filename}
                            description={book_info.google_info.description ? book_info.google_info.description : ""}
                            key={key}
                            cover={book_info.google_info.thumbnail ? book_info.google_info.thumbnail : ""} />

                    }

                }

                )}
            </Space>
            {!loadingBooklist && <Flex justify="center" align="center">
                {bookCount > bookList.length &&
                    <Button
                        loading={loadingBooklist}
                        icon={<ArrowDownOutlined />}
                        type="primary"
                        onClick={() => loadMoreBooks()}>
                        more
                    </Button>}
            </Flex>}
            {bookCount === bookList.length && <Divider >End </Divider>}
        </Layout>
    )
}