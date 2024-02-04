import { useContext } from "react";
import { AppContext } from "./utils/AppProvider";
import { useNavigate } from "react-router-dom";
import { Button, List, Slider, Switch } from "antd";
import { Title } from "../App";

export default function Settings() {
  const {
    imageDarkMode, setImageDarkMode,
    isDarkTheme, onToggleTheme,
    fontSize, setFontSize,
    pdfText, setPdfText,
    ocr, setOcr,
    pdfImage, setPdfImage,
    clickToLargeImage, setClickToLargeImage,
    pageImage, setPageImage, isMobile, onLogout } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <div style={{ padding: "10px" }}>
      <div style={{
        width: isMobile ? "100%" : "700px", margin: "auto"
      }}>
        <Title style={{ width: "100%", }}>Settings</Title>
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
            <Button
              onClick={() => {
                onLogout()
                navigate("/")
              }}
              block size='large'
              fill="outline">
              Logout
            </Button>
          </List.Item>
        </List>
      </div>
    </div>
  );
}
