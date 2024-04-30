

import { Drawer, List, Tabs } from "antd"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { AppContext } from "../../utils/AppProvider"
import BookmarkList from "../pages/PageBookmarkList"



export default function ReadChapterMenu({ visible, setVisibility }) {
    const { isMobile } = useContext(AppContext)
    const { book_id } = useParams()
    const [bookmarks, setBookmarks] = useState([])
    const [chapters, setChapters] = useState([])

    useEffect(() => {


    }, [])



    return (
        <Drawer
            title="Chapters and bookmarks"
            open={visible}
            placement={isMobile ? "bottom" : 'right'}
            onClose={() => {
                setVisibility(false)
            }}>
            <Tabs items={[
                {
                    key: '1',
                    label: 'Chapters',
                    children: (
                        <List>

                            {chapters.map((item, key) =>
                                <ChapterItem
                                    key={key} title={item.title} book_id={book_id}
                                    // description={item.level}
                                    page_no={item.page_no} />
                            )}
                        </List>
                    )
                },
                {
                    key: '2',
                    label: 'Bookmarks',
                    children: <BookmarkList minimal={true} bookmarks={bookmarks} />
                },
            ]} />
        </Drawer>
    )
}

function ChapterItem({ title, description, book_id, page_no }) {
    const navigate = useNavigate()
    return (
        <List.Item
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigate(`/book/${book_id}/${page_no}`)
            }}>
            <List.Item.Meta title={title} description={description} />
        </List.Item>)
}