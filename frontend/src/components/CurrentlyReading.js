import { Layout, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { getBooksFromBackend } from "../utils/backend";
import BookCard from "./home/BookCard";
import LoadingBookList from "./home/LoadingBookList";


export default function CurrentlyReading() {
    const [bookList, setBookList] = useState([])
    const [loadingBooklist, setLoadingBooklist] = useState(true)

    useEffect(() => {
        setLoadingBooklist(true)
        // library
        getBooksFromBackend()
            .then(res => {

                if (res) setBookList([...res.books, ...res.books, ...res.books,])
                setLoadingBooklist(false)
                console.log(res)

            })
            .catch(e => {
                setBookList([])
            })
    }, [])

    return (
        <Layout style={{ padding: "10px" }}>
            <Typography.Title level={2}>Currently Reading</Typography.Title>
            {loadingBooklist && <LoadingBookList />}
            <Space align="start" wrap>
            

                {!loadingBooklist && bookList.map((item, key) =>
                    item.google_info && <BookCard
                        id={item.id}
                        title={item.google_info.title}
                        description={item.google_info.description}
                        key={key}
                        cover={item.google_info.thumbnail} />
                )}
            
            </Space>
        </Layout>
    )
}