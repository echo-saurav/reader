import { Divider, Typography } from "antd";
import { App, Button, List, Slider, Switch } from "antd";
import { useContext } from "react";
import { AppContext } from "../utils/AppProvider";
import { useNavigate } from "react-router-dom";


export default function Settings() {
    const {
        uid,
        imageDarkMode, setImageDarkMode,
        isDarkTheme, onToggleTheme,
        fontSize, setFontSize,
        pdfText, setPdfText,
        ocr, setOcr,
        pdfImage, setPdfImage,
        clickToLargeImage, setClickToLargeImage,
        pageImage, setPageImage, isMobile, onLogout } = useContext(AppContext)
    const { message, notification, modal } = App.useApp();
    const navigate=useNavigate()

    const onLogoutButtonClick = () => {
        modal.confirm({
            title: "Logout",
            content: "Are you sure you want to logout?",
            onOk: () => {
                onLogout()
                message.success('Logout successful')
                navigate("/")
            },

        })
    }

    const onResetServerClick = () => {
        modal.error({
            title: "Reset and re-scan server",
            content: "This will remove all file index bookmarks and rebuild database",
            onOk: () => {
                message.success('restart started successful')
            },

        })
    }

    return (
        <div style={{ padding: "0px" }}>
            <div style={{
                maxWidth: "1200px"
                //   width: isMobile ? "100%" : "700px", margin: "auto"
            }}>
                <div style={{ marginLeft: "20px", maxWidth: "500px" }}>

                    <Typography.Title level={2}>Settings</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        These are default settings for book view,
                        Some books/pdf have different page layout, language , size.
                        you can also set book specific settings
                        per book in the book view settings
                    </Typography.Paragraph>
                </div>

                <List size="large">
                    <List.Item
                        extra={
                            <Switch checked={isDarkTheme} onChange={() => { onToggleTheme() }} />
                        } >
                        <List.Item.Meta title="Toggle dark theme" />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title={`Font size ${fontSize}`}
                            description={
                                <Slider
                                    value={fontSize}
                                    onChange={(e) => { setFontSize(e) }}
                                    step={1}
                                    min={10}
                                    max={35}
                                    ticks
                                />} />
                    </List.Item>


                    <List.Item
                        extra={
                            <Switch checked={imageDarkMode} onChange={() => { setImageDarkMode(!imageDarkMode) }} />
                        } >
                        <List.Item.Meta title="Inverse image dark mode" />

                    </List.Item>
                    <List.Item
                        extra={
                            <Switch checked={clickToLargeImage} onChange={() => { setClickToLargeImage(!clickToLargeImage) }} />
                        } >
                        <List.Item.Meta title="Click to fullscreen image" />

                    </List.Item>
                    <List.Item
                        extra={
                            <Switch checked={pdfText} onChange={() => { setPdfText(!pdfText) }} />
                        } >

                        <List.Item.Meta title="Enable pdf text" />

                    </List.Item>
                    <List.Item
                        extra={
                            <Switch checked={pdfImage} onChange={() => { setPdfImage(!pdfImage) }} />
                        } >

                        <List.Item.Meta title="Enable pdf images" />

                    </List.Item>
                    <List.Item
                        extra={
                            <Switch checked={ocr} onChange={() => { setOcr(!ocr) }} />
                        } >

                        <List.Item.Meta title="Enable pdf OCR texts" />
                    </List.Item>
                    <List.Item
                        extra={
                            <Switch checked={pageImage} onChange={() => { setPageImage(!pageImage) }} />
                        } >

                        <List.Item.Meta title="Enable pdf page image" />
                    </List.Item>
                    <List.Item>
                        <Button.Group >
                            <Button
                                onClick={()=>{onResetServerClick()}}
                                size="large" >
                                Reset server
                            </Button>
                            <Button
                                danger
                                onClick={() => {
                                    onLogoutButtonClick()
                                }}
                                block size='large'
                                fill="outline">
                                Logout
                            </Button>
                        </Button.Group>
                    </List.Item>
                </List>
            </div>
        </div>

    )
}