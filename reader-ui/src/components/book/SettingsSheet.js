import { Button, Input, List, SearchBar, Slider, Space, Switch, Toast } from "antd-mobile";
import { useContext, useState } from "react";
import { AppContext } from "../utils/AppProvider";
import { useNavigate } from "react-router-dom";


export default function SettingsSheet({ currentPage = 1, totalPage = 0, book_id, setPopupVisible }) {
    const {
        clickToLargeImage, setClickToLargeImage,
        imageDarkMode, setImageDarkMode,
        isDarkTheme, onToggleTheme,
        fontSize, setFontSize,
        pdfText, setPdfText,
        ocr, setOcr,
        pdfImage, setPdfImage,
        pageImage, setPageImage } = useContext(AppContext)

    const [goTo, setGoto] = useState(currentPage)
    const navigate = useNavigate()

    const goToInput = () => {
        const page_number = parseInt(goTo)
        if (page_number) {
            if (page_number > 0 && totalPage >= page_number) {
                navigate(`/book/${book_id}/${goTo}`)
                setPopupVisible(false)
            } else {
                Toast.show({ content: 'Please choose valid page no', position: 'bottom' })
            }
        } else {
            setGoto(currentPage)
        }

    }

    return (
        <div style={{overflow:"scroll", height:"100%"}}>
            <List>
                <List.Item>
                    <SearchBar placeholder="search text" />
                </List.Item>
                <List.Item>
                    <Button block >Show Chapters</Button>
                </List.Item>
                <List.Item
                    extra={
                        <Space direction="horizontal" justify='center' align="center">
                            <Input onChange={(no) => { setGoto(no) }} value={goTo}
                                placeholder={`between 1 to ${totalPage}`} type="number" />
                            <Button onClick={() => { goToInput() }} color='primary' fill='solid'>Go</Button>
                        </Space>
                    } >
                    Go to page
                </List.Item>
                <List.Item
                    extra={
                        <Switch checked={isDarkTheme} onChange={() => { onToggleTheme() }} />
                    } >
                    Toggle dark theme
                </List.Item>
                <List.Item>
                    <p style={{ margin: '0' }}>{`Font size ${fontSize}`}</p>
                </List.Item>
                <List.Item>
                    <Slider
                        value={fontSize}
                        onChange={(e) => { setFontSize(e) }}
                        step={1}
                        min={10}
                        max={35}
                        ticks
                    />
                </List.Item>
                <List.Item
                    extra={
                        <Switch checked={imageDarkMode} onChange={() => { setImageDarkMode(!imageDarkMode) }} />
                    } >
                    Inverse image dark mode
                </List.Item>
                <List.Item
                    extra={
                        <Switch checked={clickToLargeImage} onChange={() => { setClickToLargeImage(!clickToLargeImage) }} />
                    } >
                    Click to fullscreen image
                </List.Item>

                <List.Item
                    extra={
                        <Switch checked={pdfText} onChange={() => { setPdfText(!pdfText) }} />
                    } >
                    Enable pdf text
                </List.Item>
                <List.Item
                    extra={
                        <Switch checked={pdfImage} onChange={() => { setPdfImage(!pdfImage) }} />
                    } >
                    Enable pdf images
                </List.Item>
                <List.Item
                    extra={
                        <Switch checked={ocr} onChange={() => { setOcr(!ocr) }} />
                    } >
                    Enable pdf OCR texts
                </List.Item>
                <List.Item
                    extra={
                        <Switch checked={pageImage} onChange={() => { setPageImage(!pageImage) }} />
                    } >
                    Enable pdf page image
                </List.Item>
            </List>
        </div>
    )

}

