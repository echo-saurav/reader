import { ArrowLeftOutlined, BookOutlined, EditOutlined, LeftOutlined, MenuOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons"
import { Affix, App, Badge, Button, Flex } from "antd"
import { useContext, useEffect, useState } from "react"


// import { deleteBookmarkToBackend, getBookmarksFromBackend, saveBookmarkToBackend } from "../utils/backend";
import { AppContext } from "../../utils/AppProvider";
import SettingsSheet from "./SettingsSheet";
import ChapterList from "./ChapterList";


export default function PageMenu({
    book_id, currentPage, book_info, bookmarks,
    chapters, showBadge, updateBookmark }) {
    const [settingVisibility, setSettingVisibility] = useState(false)
    const [chaptersVisibility, setChaptersVisibility] = useState(false)

    const { message } = App.useApp()
    const { uid } = useContext(AppContext)

    const onBookmarkPage = () => {
        if (showBadge) {
            // deleteBookmarkToBackend(uid, book_id, currentPage).then(res => {
            //     message.info("Bookmark deleted!")
            //     updateBookmark()
            // })
        } else {

            // saveBookmarkToBackend("", uid, book_id, currentPage).then(res => {
            //     message.success("Bookmark added!")
            //     updateBookmark()
            // })
        }
    }


    return (
        <>
            <Affix offsetTop={10}>
                <Flex justify="start" style={{ padding: "10px" }}>
                    <Button href="/" style={{ marginRight: "5px", border: "none" }} shape="circle" icon={<ArrowLeftOutlined />} />

                    <Flex justify="end" style={{ flex: 1 }} >
                        <Badge dot={showBadge}>
                            <Button
                                onClick={() => { onBookmarkPage() }}
                                style={{ marginLeft: "5px", border: "none" }}
                                shape="circle" icon={<BookOutlined />} />
                        </Badge>
                        {/* <Button style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<SearchOutlined />} /> */}
                        <Button onClick={() => { setChaptersVisibility(true) }}
                            style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<MenuOutlined />} />
                        <Button onClick={() => { setSettingVisibility(true) }}
                            style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<SettingOutlined />} />
                    </Flex>
                </Flex>
            </Affix>

            {/* sidebar */}
            <SettingsSheet
                visible={settingVisibility}
                setVisibility={setSettingVisibility}
                currentPage={currentPage}
                totalPage={book_info.page_no}
                book_id={book_id} />

            <ChapterList
                loadBookmarks={updateBookmark}
                bookmarks={bookmarks}
                chapters={chapters}
                page_no={currentPage}
                visible={chaptersVisibility}
                setVisibility={setChaptersVisibility}
            />
        </>
    )
}