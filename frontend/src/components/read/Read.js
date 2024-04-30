import { Layout } from "antd";
import { ReadContext, ReadProvider } from "./ReadContext";
import Pagination from "./Pagination";
import { ArrowLeftOutlined, BookOutlined, MenuOutlined, SettingOutlined } from "@ant-design/icons"
import { Affix, Badge, Button, Flex } from "antd"
import { useContext, useState } from "react";
import SettingsSheet from "../pages/SettingsSheet";
import ChapterList from "../pages/ChapterList";
import ReadSetting from "./ReadSetting";
import ReadChapterMenu from "./ReadChapterMenu";



function Read() {
    const [settingVisibility, setSettingVisibility] = useState(false)
    const [chaptersVisibility, setChaptersVisibility] = useState(false)
    const { showBadge } = useContext(ReadContext)

    const onBookmarkPage = () => {

    }

    return (
        <Layout>
            <Affix offsetTop={10}>
                <Flex justify="start" style={{ padding: "10px" }}>
                    <Button href="/" style={{ marginRight: "5px", border: "none" }}
                        shape="circle" icon={<ArrowLeftOutlined />} />

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
            <ReadSetting
                visible={settingVisibility}
                setVisibility={setSettingVisibility}
            />
            <ReadChapterMenu
                visible={chaptersVisibility}
                setVisibility={setChaptersVisibility}
            />
            <Pagination />
        </Layout>
    )
}



export default function ReadContextWrapper() {
    return <ReadProvider>
        <Read />
    </ReadProvider>
}