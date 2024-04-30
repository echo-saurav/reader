import { App, Button, Drawer, Input, List, Space, Typography } from "antd";
// import { deleteBookmarkToBackend, saveBookmarkToBackend } from "../utils/backend";
import { useContext, useState } from "react";
import BookmarkItem from "../bookmarks/BookmarkItem";
import { AppContext } from "../../utils/AppProvider";



export default function BookmarkList({ minimal = false, bookmarks, loadBookmarks }) {
    const { modal, message } = App.useApp()
    const { uid, isMobile } = useContext(AppContext)
    const [visible, setVisibility] = useState(false)
    const [selectedBookmarkText, setSelectedBookmarkText] = useState("")
    const [book_id, setBook_id] = useState("")
    const [page_no, setPage_no] = useState(-1)

    const onDelete = (book_id, page_no) => {
        modal.confirm({
            title: "Delete bookmark",
            content: "Are you sure you want to delete this bookmark?",
            onOk: () => {

                // deleteBookmarkToBackend(uid, book_id, page_no).then(() => {
                //     loadBookmarks()
                //     message.success("Bookmark delete successful")
                // }).catch(() => {
                //     message.error("Bookmark delete error")
                // })
            }
        })
    }

    const onEdit = (text, book_id, page_no) => {
        if (book_id && page_no) {
            setSelectedBookmarkText(text)
            setBook_id(book_id)
            setPage_no(page_no)
            setVisibility(true)
        } else {
            message.error("Bookmark edit error")
        }


    }

    return (
        (bookmarks && bookmarks.length > 0) && <>
            {!minimal && <Typography.Title level={2}>Bookmarks</Typography.Title>}
            <List>
                {bookmarks.map((item, index) =>
                    <BookmarkItem
                        minimal={minimal}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        key={index}
                        book_id={item.book_id}
                        book_info={item.book_info}
                        page_no={item.page_no}
                        text={item.text} />
                )}
            </List>
            <Drawer
                title="Edit Bookmark"
                open={visible}
                placement={isMobile ? "bottom" : 'right'}
                onClose={() => {
                    setVisibility(false)
                }}>
                <Space direction="vertical" style={{ width: "100%" }}>

                    <Input.TextArea
                        rows={5}
                        value={selectedBookmarkText}
                        onChange={(v) => { setSelectedBookmarkText(v.target.value) }}
                        placeholder="Write bookmark notes here..." />

                    <Button onClick={() => {
                        // saveBookmarkToBackend(selectedBookmarkText, uid, book_id, page_no).then(() => {
                        //     loadBookmarks()
                        //     message.success("Bookmark edit successful")
                        //     setVisibility(false)
                        // }).catch(() => {
                        //     message.error("Bookmark edit error")
                        //     setVisibility(false)
                        // })
                    }} type="primary" block>Done</Button>
                </Space>
            </Drawer>
        </>
    )
}