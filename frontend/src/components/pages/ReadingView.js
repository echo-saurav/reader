import { ArrowLeftOutlined, BookOutlined, MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { Affix, App, Badge, Button, Flex } from "antd";
import Layout from "antd/es/layout/layout";
import { useContext, useState } from "react";
import { AppContext } from "../../utils/AppProvider";
import PaginationWrapper, { Pages } from "./Pages";
import SettingsSheet from "./SettingsSheet";
import ChapterList from "./ChapterList";



export default function ReadingView() {


    const [showBadge, setShowBadge] = useState(false)

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
                        {/* <Button onClick={() => { setChaptersVisibility(true) }}
                            style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<MenuOutlined />} />
                        <Button onClick={() => { setSettingVisibility(true) }}
                            style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<SettingOutlined />} /> */}
                    </Flex>
                </Flex>
            </Affix>


            <PaginationWrapper />
        </>
    )

}