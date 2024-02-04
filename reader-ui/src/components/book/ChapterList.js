import { Drawer, List, Tabs } from "antd"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../utils/AppProvider"


export default function ChapterList({ visible, setVisibility }) {
    const [chapters, setChapters] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const { isMobile } = useContext(AppContext)


    useEffect(() => {
        setChapters([
            { 'title': 'This title', 'description': 'This is a description' },
            { 'title': 'This title', 'description': 'This is a description' },
            { 'title': 'This title', 'description': 'This is a description' },
            { 'title': 'This title', 'description': 'This is a description' },
            { 'title': 'This title', 'description': 'This is a description' },
            { 'title': 'This title', 'description': 'This is a description' },
            { 'title': 'This title', 'description': 'This is a description' },
        ])
    },[])

    return (
        <Drawer
            title="Chapters"
            open={visible}
            placement={isMobile ? "bottom" : 'right'}
            onClose={() => {
                setVisibility(false)
            }}>
            <Tabs items={[
                {
                    key: '1',
                    label: 'Chapters',
                    children: (chapters.map((item, key) =>
                        <ChapterItem key={key} title={item.title} description={item.description} />
                    ))
                },
                {
                    key: '2',
                    label: 'Bookmarks',
                    children: (chapters.map((item, key) =>
                        <ChapterItem key={key} title={item.title} description={item.description} />
                    ))
                },
            ]} />
        </Drawer>
    )
}

function ChapterItem({ title, description, book_id, page_no }) {
    const navigate = useNavigate()
    return (
        <List.Item onClick={() => {
            navigate(`/book/${book_id}/${page_no}`)
        }}>
            <List.Item.Meta title={title} description={description} />
        </List.Item>)
}