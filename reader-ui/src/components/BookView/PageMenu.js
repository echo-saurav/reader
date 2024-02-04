import { BookOutlined, LeftOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons"
import { Affix, Badge, Button, Flex } from "antd"
import { useState } from "react"
import SettingsSheet from "../book/SettingsSheet";
import BookmarkModal from "../book/BookmarkModal";
import ChapterList from "../book/ChapterList";

export default function PageMenu({book_id,currentPage,book_info}) {
    const [settingVisibility, setSettingVisibility] = useState(false)
    const [chaptersVisibility, setChaptersVisibility] = useState(false)
    const [bookmarkPopupVisible, setBookmarkPopupVisible] = useState(false)

    return (
        <>
            <Affix offsetTop={10}>
                <Flex justify="start" style={{ padding: "10px" }}>
                    <Button style={{ marginRight: "5px" }} shape="circle" icon={<LeftOutlined />} />
                    <Flex justify="end" style={{ flex: 1 }} >
                        <Badge dot={true}>
                            <Button onClick={() => { setChaptersVisibility(true) }}
                                style={{ marginLeft: "5px" }} shape="circle" icon={<BookOutlined />} />
                        </Badge>
                        <Button style={{ marginLeft: "5px" }}
                            shape="circle" icon={<SearchOutlined />} />
                        <Button onClick={() => { setSettingVisibility(true) }}
                            style={{ marginLeft: "5px" }} shape="circle" icon={<SettingOutlined />} />
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

            <BookmarkModal
                setVisible={setBookmarkPopupVisible}
                book_id={book_id}
                page_no={currentPage}
                visible={bookmarkPopupVisible} />

            <ChapterList
                book_id={book_id}
                page_no={currentPage}
                visible={chaptersVisibility}
                setVisibility={setChaptersVisibility}
            />
        </>
    )
}