import { Button, Divider, Flex, Layout, Space, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { getBooksFromBackend, getCurrentBooksFromBackend } from "../utils/backend";
import BookCard from "./home/BookCard";
import { ArrowRightOutlined } from "@ant-design/icons";
import LoadingBookList from "./home/LoadingBookList";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { AppContext } from "../utils/AppProvider";



export default function BookList() {
    const [bookList, setBookList] = useState([])
    const [bookCount, setBookCount] = useState(0)
    const [loadingBooklist, setLoadingBooklist] = useState(true)
    const [currentlyReading, setCurrentlyReading] = useState([])
    const [loadingCurrentlyReading, setLoadingCurrentlyReading] = useState(true)
    const navigate = useNavigate()
    const { uid } = useContext(AppContext)
    const bookLimit = 2

    const loadReacntBooks = () => {

        setLoadingBooklist(true)
        // library
        getBooksFromBackend(null, uid, 20)
            .then(res => {

                if (res) {
                    setBookList(res.books)
                    setBookCount(res.count ? res.count : 0)
                }
                // setLoadingBooklist(false)
                console.log(res)

            })
            .catch(e => {
                setBookList([])
            })

    }

    const loadCurrentlyReadingBooks = () => {
        // currently reading
        setLoadingCurrentlyReading(true)
        getCurrentBooksFromBackend(null, uid, 5).then(res => {

            if (res) setCurrentlyReading(res.books)
            setLoadingCurrentlyReading(false)
            console.log(res)

        }).catch(e => {
            setCurrentlyReading([])
        })

    }

    useEffect(() => {
        loadReacntBooks()
        loadCurrentlyReadingBooks()

    }, [])


    return (
        <Layout style={{ padding: "10px" }}>
            {(currentlyReading && currentlyReading.length > 0) && <Flex style={{ margin: "30px 0px" }} justify="space-between" align="center">
                <Typography.Title style={{ margin: 0 }} level={2}>Currently Reading</Typography.Title>
                <Button onClick={() => { navigate("/home/currentlyReading") }} icon={<ArrowRightOutlined />}>more</Button>
            </Flex>
            }
            {/* currently reading */}
            {loadingCurrentlyReading && <LoadingBookList />}
            {(currentlyReading && currentlyReading.length > 0) &&
                <div>
                    <Space align="start" wrap>
                        {!loadingCurrentlyReading && currentlyReading.map((item, key) =>
                            item.google_info && <BookCard
                                id={item.id}
                                // progress={item.settings ? item.settings[0].progress : 1}
                                progress={300}
                                title={item.google_info.title}
                                description={'ldkjkfjk'}
                                // description={item.google_info.description}
                                key={key}
                                cover={item.google_info.thumbnail} />

                        )}
                    </Space>
                    <Divider />
                </div>
            }

            {/* library */}


            <Flex style={{ margin: "30px 0px" }} justify="space-between" align="center">
                <Typography.Title style={{ margin: 0 }} level={2}>Recently added</Typography.Title>
                <Button onClick={() => { navigate("/home/library") }} icon={<ArrowRightOutlined />}>more</Button>
            </Flex>
            {/* {loadingBooklist && <LoadingBookList />} */}

            <Space align="start" wrap>
                {bookList.map((item, key) =>
                    item.google_info && <BookCard
                        id={item.id}
                        title={item.google_info.title}
                        description={item.google_info.description}
                        cover={item.google_info.thumbnail}
                        key={key}
                        settings={item.settings}
                        page_no={item.page_no}
                    />

                )}
            </Space>
        </Layout >
    )
}

