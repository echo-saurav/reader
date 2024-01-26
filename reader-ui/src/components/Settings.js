import { AutoCenter, Button, List, NavBar, Slider, Switch } from "antd-mobile";
import { useContext } from "react";
import { AppContext } from "./utils/AppProvider";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const {
    imageDarkMode,setImageDarkMode,
    isDarkTheme, onToggleTheme,
    fontSize, setFontSize,
    pdfText, setPdfText,
    ocr, setOcr,
    pdfImage, setPdfImage,
    clickToLargeImage,setClickToLargeImage,
    pageImage, setPageImage, isMobile, onLogout } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div style={{ padding: "10px" }}>
      <NavBar onBack={() => { navigate("/") }} style={{ marginBottom: "30px" }}>Settings</NavBar>
      <div style={{
        width: isMobile ? "100%" : "700px", margin: "auto"
      }}>

        <List>
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
          <List.Item>
            <Button
              onClick={() => {
                onLogout()
                navigate("/")
              }}
              block size='large' color="danger" fill="outline">
              Logout
            </Button>
          </List.Item>
        </List>
      </div>
    </div>
  );
}
