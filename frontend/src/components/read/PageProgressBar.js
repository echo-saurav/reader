import { Button, Drawer, InputNumber, Progress, Slider, Typography } from "antd";
import { useContext } from "react";
import { ReadContext } from "./ReadContext";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";



export default function PageProgressBar() {
    const { currentVisiblePage, progress,
        loading, book_info,
        setStartPageFrom,
        jumpOpen, setJumpOpen,
        setCurrentVisiblePage ,setContents} = useContext(ReadContext)
    const spacing = "18px"
    const [jumpPage, setJumpPage] = useState(currentVisiblePage)
    

    const onGotoPage = () => {
        setContents([])
        setCurrentVisiblePage(jumpPage)
        setStartPageFrom(jumpPage)
        
        setJumpOpen(false)
        
    }

    return (
        <>
            {/* <Typography.Text
                style={{ position: "fixed", bottom: 0, right: 0, marginBottom: spacing, marginRight: "10px" }}>
                {book_info.google_info ? book_info.google_info.title : book_info.filename}
            </Typography.Text> */}
            {loading && <LoadingOutlined
                style={{ position: "fixed", bottom: 0, right: 0, margin: "30px 17px" }} />}
            <Progress
                format={() => `${currentVisiblePage}`}
                style={{ position: "fixed", bottom: "0", height: spacing }}
                percent={progress}
                onClick={() => { setJumpOpen(true) }}
                size={["100%", 10]}
                // showInfo={false}
                strokeLinecap="square" />
            <Drawer
                height={230}
                title={`jump to ${jumpPage}`}
                placement="bottom"
                // placement={isMobile ? "bottom" : 'right'}
                onClose={() => { setJumpOpen(false) }}
                open={jumpOpen}>

                <InputNumber
                    min={1}
                    max={book_info.page_no}
                    style={{ width: "100%", fontSize: "23px", margin: 0 }}
                    value={jumpPage}
                    onChange={(v) => { setJumpPage(v) }}
                />
                <Slider
                    style={{ margin: 0 }}
                    value={jumpPage}
                    onChange={(v) => { setJumpPage(v) }}
                    min={1}
                    max={book_info.page_no} />

                <Button
                    onClick={() => { onGotoPage() }}
                    icon={<ArrowRightOutlined />}
                    type="primary">
                    Go
                </Button>
            </Drawer>
        </>
    )
}   