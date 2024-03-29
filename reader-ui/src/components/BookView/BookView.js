import { App, Button, Col, Image, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookFromBackend, getBookmarksFromBackend, getChaptersFromBackend, getPageFromBackend, page_limit, setProgressToBackend, waitBeforeUpdatePage } from "../utils/backend";
import { AppContext } from "../utils/AppProvider";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

import Page from "../book/Page";
import PageMenu from "./PageMenu";
import { Paragraph, Title } from "../../App";
import { API } from "../utils/Variables";


export default function BookView() {
    const scrollOffset = -45

    const [book_info, setBookInfo] = useState({})
    const [contents, setContents] = useState([])
    const [bookmarks, setBookmarks] = useState([])
    const [chapters, setChapters] = useState([])
    const [showBadge, setShowBadge] = useState(false)

    const [currentPage, setCurrentPage] = useState(0)
    const [lastPos, setLastPos] = useState(0)
    const { book_id, page_no = 1 } = useParams()
    const { message, notification, modal } = App.useApp()
    const { uid } = useContext(AppContext)

    // initial loading pages
    useEffect(() => {

        // load book info
        getBookFromBackend(book_id, uid).then((info) => {
            if (info && info.length > 0) {
                setBookInfo(info[0])
            }
        }).then(() => {
            // load page 
            getPageFromBackend(book_id, page_no).then((contents) => {
                setContents(contents)
                setCurrentPage(parseInt(page_no))
            })
            // load bookmarks
            updateBookmark()
            updateChapters()
        })

    }, [])

    const updateBookmark = () => {
        getBookmarksFromBackend(uid, book_id).then((res) => {
            setBookmarks(res)       
        })
    }

    const updateChapters=()=>{
        getChaptersFromBackend(book_id).then((res)=>{
            setChapters(res)
        })
    }

    const loadMorePreviousPage = () => {
        console.log("click")
        if (contents.length > 0) {
            const first_page = parseInt(contents[0].page_no)

            if (first_page === 1) return

            const start_from = first_page > page_limit ? first_page - page_limit : 1
            const limit = page_limit < first_page ? page_limit : first_page - 1

            getPageFromBackend(book_id, start_from, limit).then((new_contents) => {
                setContents([...new_contents, ...contents])
                setLastPos(first_page)
                console.log(new_contents)
            })
        }
    }
    const loadMoreNextPage = async () => {
        if (contents.length > 0) {
            const last_page = parseInt(contents[contents.length - 1].page_no) + 1
            console.log(contents)
            await getPageFromBackend(book_id, last_page).then((new_contents) => {
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
                <Row justify="center" align="middle">
                    <Button
                        type="primary"
                        icon={<UpOutlined />}
                        size="small"
                        // style={{ marginTop: "70px" }}
                        id="loadMoreButton"
                        onClick={() => { loadMorePreviousPage() }}
                    >Load previous pages</Button>
                </Row>
            )
        }
    }

    const hasMoreNext = () => {
        if (contents.length > 0) {
            const last_page = parseInt(contents[contents.length - 1].page_no)

            if (book_info.page_no > last_page) {
                return (
                    <Row justify="center" align="middle" style={{ margin: "30px" }}>
                        <Button
                            type="primary"
                            icon={<DownOutlined />}
                            size="small"
                            style={{ marginTop: "70px" }}
                            id="loadMoreButton"
                            onClick={() => { loadMoreNextPage() }}
                        >Load next pages</Button>
                    </Row>
                )
            } else {
                return
            }
        }
        return
    }

    // scroll listener
    useEffect(() => {
        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => { updatePageView(); }, waitBeforeUpdatePage);
        };
        let timeout;
        window.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeout);
        };

    }, [])

    // check if this page bookmarked
    useEffect(() => {
        setShowBadge(false)
        bookmarks.map(item => {
            if (item.page_no === currentPage) {
                setShowBadge(true)
            }
        })

    }, [currentPage, bookmarks])


    // scroll to past position after loading new element on top
    useEffect(() => {
        if (lastPos > 0) {
            scrollInto(lastPos)
            console.log("scroll into ", lastPos)
            updatePageView()
        } else {
            window.scrollBy(0, scrollOffset * -1)
        }
    }, [contents])


    const scrollInto = (key) => {
        const divToScrollTo = document.getElementById(key);
        if (divToScrollTo) {
            divToScrollTo.scrollIntoView();
            window.scrollBy(0, scrollOffset)
            message.success('Scroll up to read more')
        }
    }


    // update current page to backend 
    const updatePageView = async () => {
        const parentDiv = document.getElementById('pages');
        const childDivs = parentDiv.children;


        for (const childDiv of childDivs) {
            const isVisible = isElementInViewport(childDiv)

            if (isVisible) {
                // update current page
                setCurrentPage(parseInt(childDiv.id))
                await setProgressToBackend(book_id, uid, parseInt(childDiv.id))

            }
        }


    }
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top < windowHeight / 2 && rect.bottom > 0
        )
    };


    return (
        <>
            <PageMenu
                book_id={book_id}
                currentPage={currentPage}
                book_info={book_info}
                bookmarks={bookmarks}
                chapters={chapters}
                showBadge={showBadge}
                updateBookmark={updateBookmark}
            />

            <Row justify="center" align="middle">
                <Col xs={23} md={20} lg={14} xxl={10} id="pages">

                    {(contents.length > 0 && contents[0].page_no === 1)
                        && <div style={{ paddingTop: "100px" }}>
                            <Title>{book_info.name}</Title>
                            <Title type="secondary" strong>{book_info.description}</Title>
                            <Image preview={false} src={`${API}/${book_info.cover}`} />
                        </div>}

                    {hasMorePrevious()}
                    {contents.map((content, index) => <Page key={index} content={content} />)}
                    {hasMoreNext()}
                </Col>

            </Row>

            <div style={{
                position: "fixed",
                bottom: "0",
                right: "0",
                padding: "5px"
            }}>
                <Paragraph style={{ margin: "0" }}>
                    {currentPage} / {book_info.page_no}
                </Paragraph>
            </div>

        </>
    )

}