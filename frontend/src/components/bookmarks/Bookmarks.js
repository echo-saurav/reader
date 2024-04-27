import { Layout, List, Typography } from "antd";
import { useEffect, useState } from "react";
import { getBooksFromBackend } from "../../utils/backend";
import BookmarkItem from "./BookmarkItem";



export default function Bookmarks() {
    const [bookmarkList, setBookmarkList] = useState([])
    const [loadingBookmarkList, setLoadingBookmarkList] = useState(true)

    useEffect(() => {
        setLoadingBookmarkList(true)
        // library
        getBooksFromBackend()
            .then(res => {

                if (res) setBookmarkList([...res.books, ...res.books, ...res.books,])
                setLoadingBookmarkList(false)
                console.log(res)

            })
            .catch(e => {
                setBookmarkList([])
            })
    }, [])

    const onEdit = () => {

    }
    const onDelete = () => {

    }

    return (
        <Layout style={{ padding: "10px" }}>
            <Typography.Title style={{ margin: 0 }} level={2}>Bookmarks</Typography.Title>
            {loadingBookmarkList && <loadingBookmarkList />}
            {!loadingBookmarkList && <List>
                {bookmarkList.map((v, k) => <BookmarkItem
                    minimal={false}
                    page_no={10}
                    title={v.google_info.title}
                    text={v.google_info.description}
                    cover={v.google_info.thumbnail}
                    book_id={10}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />)}
            </List>}
        </Layout>
    )
}