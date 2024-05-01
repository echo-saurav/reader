import { Button, Col, Flex, Row } from "antd";
import Page from "./Page";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import { useContext, useEffect } from "react";
import { ReadContext } from "./ReadContext";

export const scrollOffset = -180

export default function LoadedPages({ contents }) {

    const { book_info, setStartPageFrom, lastPos, loading } = useContext(ReadContext)
    const page_limit = 10

    const scrollInto = (key) => {
        const divToScrollTo = document.getElementById(key);
        if (divToScrollTo) {
            divToScrollTo.scrollIntoView();
            window.scrollBy(0, scrollOffset)
            // message.success('Scroll up to read more')
        }
    }

    useEffect(() => {
        // contents is empty when either its first loaded or 
        // its trigger by goto page function
        // so page needs to scroll at top before initial contents population
        if (contents.length === 0) {
            window.scrollTo(0, 0)
            console.log('empty contents', lastPos)
            return
        }
        if (contents.length > 0) {

            // lastPos = -1 when its adding content at the end
            // lastPos = "first page no" when its adding content at top
            // this for scroll effect
            if (lastPos > 0) {
                scrollInto(lastPos + "")
                console.log('scroll into ', lastPos)
            }
        }

    }, [contents])

    const loadMoreNextPage = () => {
        if (contents.length > 0) {
            const last_page = parseInt(contents[contents.length - 1].page_no) + 1
            setStartPageFrom(last_page)
        }
    }

    const loadMorePreviousPage = () => {
        if (contents.length > 0) {
            const first_page = parseInt(contents[0].page_no)

            if (first_page === 1) return

            const start_from = first_page > page_limit ? first_page - page_limit : 1
            const limit = page_limit < first_page ? page_limit : first_page - 1
            setStartPageFrom(start_from)
        }
    }

    const hasMorePrevious = () => {
        if (contents.length > 0) {
            const first_page = parseInt(contents[0].page_no)
            if (first_page === 1) {
                return
            }
            return (
                <Flex justify="center" style={{ marginTop: "100px" }}>

                    <Button
                        loading={loading}
                        type="primary"
                        icon={<UpCircleOutlined />}
                        size="small"
                        // style={{ marginTop: "70px" }}
                        id="loadMoreButton"
                        onClick={() => { loadMorePreviousPage() }}
                    >Load previous pages</Button>
                </Flex>

            )
        }
    }

    const hasMoreNext = () => {
        if (contents.length > 0) {
            const last_page = parseInt(contents[contents.length - 1].page_no)

            if (book_info.page_no > last_page) {
                return (

                    <Flex justify="center" style={{ marginBottom: "100px" }}>
                        <Button
                            loading={loading}
                            type="primary"
                            icon={<DownCircleOutlined />}
                            size="small"
                            style={{ marginTop: "70px" }}
                            id="loadMoreButton"
                            onClick={() => { loadMoreNextPage() }}
                        >Load next pages</Button>
                    </Flex>
                )
            } else {
                return
            }
        }
        return
    }



    return (
        <Row align="center">
            <Col
                id="pages"
                xs={24} md={18} lg={15} xl={12}
                style={{ minHeight: "100vh" }}>
                {hasMorePrevious()}
                {contents && contents.map((content, index) => <Page key={index} content={content} />)}
                {hasMoreNext()}
            </Col>
        </Row>
    )

}