import { Button, Drawer, Flex, InputNumber, Progress, Slider, Typography } from "antd";
import { useContext, useEffect } from "react";
import { ReadContext } from "./ReadContext";
import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";



export default function PageProgressBar() {
    const { currentVisiblePage, progress,
        loading, book_info,
        setStartPageFrom,
        setLastPos,
        jumpOpen, setJumpOpen,
        setCurrentVisiblePage, setContents } = useContext(ReadContext)
    const spacing = "17px"
    const [jumpPage, setJumpPage] = useState(currentVisiblePage)


    const onGotoPage = () => {
        setContents([])
        setCurrentVisiblePage(jumpPage)
        setStartPageFrom(jumpPage)
        setLastPos(-1)
        setJumpOpen(false)
    }

    useEffect(()=>{
        setJumpPage(currentVisiblePage)
    },[currentVisiblePage])

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
                height={260}
                // title={`jump to ${jumpPage}`}
                title={book_info.google_info && book_info.google_info.title}
                placement="bottom"
                // placement={isMobile ? "bottom" : 'right'}
                onClose={() => { setJumpOpen(false) }}
                open={jumpOpen}>

                <Flex justify="space-between" align="center">
                    <Typography.Title
                        type="secondary"
                        style={{ width: "150px", margin: 0, fontSize: "18px" }} >
                        Go to page
                    </Typography.Title>
                    <InputNumber
                        autoFocus
                        min={1}
                        max={book_info.page_no}
                        style={{ width: "100%", fontSize: "18px", margin: 0 }}
                        value={jumpPage}
                        onChange={(v) => { setJumpPage(v) }}
                    />
                </Flex>

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