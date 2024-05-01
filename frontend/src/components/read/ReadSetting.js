import { useContext } from "react";
import { Button, Drawer, InputNumber, List, Slider, Switch } from "antd";
import { AppContext } from "../../utils/AppProvider";
import { ArrowRightOutlined } from "@ant-design/icons";
import { ReadContext, ReadProvider } from "./ReadContext";


export default function ReadSetting({ visible, setVisibility }) {
    const {
        clickToLargeImage, setClickToLargeImage,
        imageDarkMode, setImageDarkMode,
        isDarkTheme, onToggleTheme,
        fontSize, setFontSize,
        pdfText, setPdfText,
        ocr, setOcr,
        pdfImage, setPdfImage,
        pageImage, setPageImage,
        isMobile } = useContext(AppContext)
    const { setJumpOpen } =  useContext(ReadContext)

    return (
        <Drawer
            bodyStyle={{padding:0}}
            height="80svh"
            title="Settings"
            open={visible}
            placement={isMobile ? "bottom" : 'right'}
            onClose={() => {
                setVisibility(false)
            }}>

            <List size="small">
                <List.Item>
                    <Button
                        onClick={() => {
                            setJumpOpen(true)
                            setVisibility(false)
                        }}
                        block
                        icon={<ArrowRightOutlined />}
                        type="primary">
                        Jump to page
                    </Button>
                </List.Item>
                <List.Item
                    extra={
                        <Switch size="small" checked={isDarkTheme} onChange={() => { onToggleTheme() }} />
                    } >
                    <List.Item.Meta title="Toggle dark theme" />

                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Font size ${fontSize}`}
                        description={
                            <Slider
                                value={fontSize}
                                onChange={(e) => { setFontSize(e) }}
                                step={1}
                                min={10}
                                max={35}
                                ticks
                            />}
                    />

                </List.Item>

                <List.Item extra={
                    <Switch size="small" checked={imageDarkMode} onChange={() => { setImageDarkMode(!imageDarkMode) }} />
                } >
                    <List.Item.Meta title="Inverse image dark mode" />

                </List.Item>
                <List.Item extra={
                    <Switch size="small" checked={clickToLargeImage} onChange={() => { setClickToLargeImage(!clickToLargeImage) }} />
                }>
                    <List.Item.Meta title="Click to fullscreen image" />
                </List.Item>

                <List.Item extra={
                    <Switch size="small" checked={pdfText} onChange={() => { setPdfText(!pdfText) }} />
                }>
                    <List.Item.Meta title="Enable pdf text" />

                </List.Item>
                <List.Item extra={
                    <Switch size="small" checked={pdfImage} onChange={() => { setPdfImage(!pdfImage) }} />
                }>
                    <List.Item.Meta title="Enable pdf images" />
                </List.Item>
                <List.Item extra={
                    <Switch size="small" checked={ocr} onChange={() => { setOcr(!ocr) }} />
                }>
                    <List.Item.Meta title="Enable pdf OCR texts" />
                </List.Item>
                <List.Item extra={
                    <Switch size="small" checked={pageImage} onChange={() => { setPageImage(!pageImage) }} />
                }>
                    <List.Item.Meta title="Enable pdf page image" />
                </List.Item>
            </List>
        </Drawer>
    )

}

