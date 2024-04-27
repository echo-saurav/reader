import { Typography } from "antd";
import { App, Button, List, Slider, Switch } from "antd";
import { useContext } from "react";
import { AppContext } from "../utils/AppProvider";


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
    return (
        <div style={{ padding: "10px" }}>
            <div style={{ maxWidth:"1200px"
                //   width: isMobile ? "100%" : "700px", margin: "auto"
            }}>
                <Typography.Title style={{ width: "100%", }}>Settings</Typography.Title>
                <List>
                    <List.Item
                        extra={
                            <Switch checked={isDarkTheme} onChange={() => { onToggleTheme() }} />
                        } >
                        <List.Item.Meta title="Toggle dark theme" />
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta title={`Font size ${fontSize}`} />
                    </List.Item>

                    <Slider
                        value={fontSize}
                        onChange={(e) => { setFontSize(e) }}
                        step={1}
                        min={10}
                        max={35}
                        ticks
                    />

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
                                // onClick={()=>{onResetServer()}}
                                size="large" >
                                Reset server
                            </Button>
                            <Button
                                danger
                                onClick={() => {
                                    //   onLogoutButtonClick()
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