import { Button, Divider, Flex, Layout, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { getBooksFromBackend } from "../utils/backend";
import BookCard from "./home/BookCard";
import { ArrowRightOutlined } from "@ant-design/icons";
import LoadingBookList from "./home/LoadingBookList";



export default function BookList() {
    const [bookList, setBookList] = useState([])
    const [loadingBooklist, setLoadingBooklist] = useState(true)
    const [currentlyReading, setCurrentlyReading] = useState([])
    const [loadingCurrentlyReading, setLoadingCurrentlyReading] = useState(true)

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

        // currently reading
        setLoadingCurrentlyReading(true)
        getBooksFromBackend().then(res => {

            if (res) setCurrentlyReading(res.books)
            setLoadingCurrentlyReading(false)
            console.log(res)

        }).catch(e => {
            setCurrentlyReading([])
        })

    }, [])


    return (
        <Layout style={{ padding: "10px" }}>
            <Flex style={{ margin: "20px 0px" }} justify="space-between" align="center">
                <Typography.Title style={{ margin: 0 }} level={2}>Currently Reading</Typography.Title>
                <Button icon={<ArrowRightOutlined />}>more</Button>
            </Flex>

            {/* currently reading */}
            {loadingCurrentlyReading && <LoadingBookList />}
            <Space wrap>
                {!loadingCurrentlyReading && currentlyReading.map((item, key) =>
                    item.google_info && <BookCard
                        title={item.google_info.title}
                        description={item.google_info.description}
                        key={key}
                        cover={item.google_info.thumbnail} />

                )}
            </Space>

            {/* library */}
            <Divider />
            <Typography.Title level={2}>Library</Typography.Title>
            {loadingBooklist && <LoadingBookList />}
            <Space wrap>
                {!loadingBooklist && bookList.map((item, key) =>
                    item.google_info && <BookCard
                        title={item.google_info.title}
                        description={item.google_info.description}
                        key={key} cover={item.google_info.thumbnail} />

                )}
            </Space>
        </Layout>
    )
}

