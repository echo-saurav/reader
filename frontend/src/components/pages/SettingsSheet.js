import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Drawer, InputNumber, List, Slider, Switch } from "antd";
import { AppContext } from "../../utils/AppProvider";
import Typography from "antd/es/typography/Typography";


export default function SettingsSheet({ currentPage = 1, totalPage = 0, book_id, visible, setVisibility }) {
    const {
        clickToLargeImage, setClickToLargeImage,
        imageDarkMode, setImageDarkMode,
        isDarkTheme, onToggleTheme,
        fontSize, setFontSize,
        pdfText, setPdfText,
        ocr, setOcr,
        pdfImage, setPdfImage,
        pageImage, setPageImage,
        showToast, isMobile } = useContext(AppContext)

    const [goTo, setGoto] = useState(currentPage)
    const navigate = useNavigate()

    useEffect(() => {
        setGoto(currentPage)
    }, [currentPage])

    const goToInput = () => {
        const page_number = parseInt(goTo)
        if (page_number) {
            if (page_number > 0 && totalPage >= page_number) {
                navigate(`/book/${book_id}/${goTo}`)
                setVisibility(false)
            } else {
                showToast("error", 'Please choose valid page no')
            }
        } else {
            setGoto(currentPage)
        }

    }

    return (
        <Drawer
            title="Settings"
            open={visible}
            placement={isMobile ? "bottom" : 'right'}
            onClose={() => {
                setVisibility(false)
            }}>
    
            <List size="large" >
                <List.Item extra={
                    <Button.Group><InputNumber style={{borderRadius:"0"}} placeholder="page no"
                        min={1} max={totalPage} onChange={(no) => { setGoto(no) }} value={goTo} />
                        <Button type="primary" onClick={() => { goToInput() }}  >Go</Button> </Button.Group>
                }>
                    <List.Item.Meta title={`Jump to page (1 - ${totalPage})`} />
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

