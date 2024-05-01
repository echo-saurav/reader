import { FloatButton, Layout } from "antd";
import { ReadContext, ReadProvider } from "./ReadContext";
import { ArrowLeftOutlined, BookOutlined, HomeOutlined, MenuOutlined, SettingOutlined } from "@ant-design/icons"
import { Affix, Badge, Button, Flex } from "antd"
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../utils/AppProvider";
import Pagination from "./Pagination";
import ReadSetting from "./ReadSetting";
import ReadChapterMenu from "./ReadChapterMenu";



function Read() {
    const [settingVisibility, setSettingVisibility] = useState(false)
    const [chaptersVisibility, setChaptersVisibility] = useState(false)
    const [openFloatButton, setOpenFloatButton] = useState(false)
    const { showBadge } = useContext(ReadContext)
    const { isMobile } = useContext(AppContext)
    const navigate = useNavigate()

    const onBookmarkPage = () => {

    }



    return (
        <Layout>
            {!isMobile && <Affix offsetTop={10}>
                <Flex justify="start" style={{ padding: "10px" }}>
                    <Button onClick={() => { navigate("/") }} style={{ marginRight: "5px", border: "none" }}
                        shape="circle" icon={<ArrowLeftOutlined />} />

                    <Flex justify="end" style={{ flex: 1 }} >
                        <Badge dot={showBadge}>
                            <Button
                                onClick={() => { onBookmarkPage() }}
                                style={{ marginLeft: "5px", border: "none" }}
                                shape="circle" icon={<BookOutlined />} />
                        </Badge>
                        <Button onClick={() => { setChaptersVisibility(true) }}
                            style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<MenuOutlined />} />
                        <Button onClick={() => { setSettingVisibility(true) }}
                            style={{ marginLeft: "5px", border: "none" }}
                            shape="circle" icon={<SettingOutlined />} />
                    </Flex>
                </Flex>
            </Affix>}
            {isMobile &&
                <FloatButton.Group
                    shape="square"
                    onClick={() => { setOpenFloatButton(!openFloatButton) }}
                    type="primary" open={openFloatButton} trigger="click" icon={<MenuOutlined />}>
                    <FloatButton onClick={() => { navigate("/") }} icon={<HomeOutlined />} />
                    <FloatButton onClick={() => { onBookmarkPage() }} icon={<BookOutlined />} />
                    <FloatButton onClick={() => { setChaptersVisibility(true) }} icon={<MenuOutlined />} />
                    <FloatButton onClick={() => { setSettingVisibility(true) }} icon={<SettingOutlined />} />

                </FloatButton.Group>}

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