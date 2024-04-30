import { useContext, useEffect, useState } from "react"
import { getBookById, getBookPages } from "../../utils/backend"
import { AppContext } from "../../utils/AppProvider"
import { useParams } from "react-router-dom"
import Page from "./Page"
import Layout from "antd/es/layout/layout"
import { Button, Col, Flex, Row } from "antd"
import FullPage from "./FullPage"
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons"


export default function Pagination({ start,  book_info }) {
    const { uid } = useContext(AppContext)
    const { book_id } = useParams()
    const page_limit = 10

    const [contents, setContents] = useState([])
    const [lastPos, setLastPos] = useState(0) // position before loading new pages


    useEffect(() => {
        // load page 
        getBookPages(book_id, uid, start,page_limit).then((contents) => {
            setContents(contents)
            console.log('loading into',start)
            // setCurrentPage(parseInt(page_no))
            // scrollInto(start+"")
        })

    }, [start])

    const loadMorePreviousPage = () => {

        if (contents.length > 0) {
            const first_page = parseInt(contents[0].page_no)

            if (first_page === 1) return

            const start_from = first_page > page_limit ? first_page - page_limit : 1
            const limit = page_limit < first_page ? page_limit : first_page - 1

            getBookPages(book_id, uid, start_from, limit).then((new_contents) => {
                setContents([...new_contents, ...contents])
                setLastPos(first_page)
                
            })
        }
    }

    const loadMoreNextPage = () => {
        if (contents.length > 0) {
            const last_page = parseInt(contents[contents.length - 1].page_no) + 1
            
            getBookPages(book_id, uid, last_page,page_limit).then((new_contents) => {
                // reset scroll to 0 if loading bottom elements
                setContents([...contents, ...new_contents])
                setLastPos(0)
            })
        }
    }

    const hasMorePrevious = () => {
        if (contents.length > 0) {
            const first_page = parseInt(contents[0].page_no)
            if (first_page === 1) {
                return
            }
            return (
                <Flex justify="center">

                    <Button
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

                    <Flex justify="center" style={{marginBottom:"100px"}}>
                        <Button
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


        // scroll to past position after loading new element on top
        useEffect(() => {
            if (lastPos > 0) {
                scrollInto(lastPos)
                console.log("scroll into ", lastPos)
                // updatePageView()
            } else {
                window.scrollBy(0, scrollOffset * -1)
            }
        }, [contents])
    
    
    
    
        // const scrollOffset = -45
        const scrollOffset = -20
        const scrollInto = (key) => {
            const divToScrollTo = document.getElementById(key);
            if (divToScrollTo) {
                divToScrollTo.scrollIntoView();
                window.scrollBy(0, scrollOffset)
                // message.success('Scroll up to read more')
            }
        }
    

    return (
        <Row align="center">
            <Col
                id="pages"
                xs={23} md={18} lg={15} xl={12}
                style={{ minHeight: "100vh" }}>

                {hasMorePrevious()}
                <FullPage contents={contents} />
                {hasMoreNext()}

            </Col>
        </Row>
    )
}