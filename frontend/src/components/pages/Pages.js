import { Button, Col, Layout, Progress, Row } from "antd";
import { useContext, useEffect, useState } from "react";
import { getBookById, getBookPages, page_limit } from "../../utils/backend";
import { useParams } from "react-router-dom";
import { AppContext } from "../../utils/AppProvider";
import Page from "./Page";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import PageMenu from "./PageMenu";
import Pagination from "./Pagination";
import GotoPageModal from "./GotoPageModal";
import SettingsSheet from "./SettingsSheet";
import ChapterList from "./ChapterList";


export default function PaginationWrapper() {

    // current page listener
    // button at top and bottom for load more page
    // check if its last page or first page, render button based on that
    // load new pages on button click
    // scroll to old page position


    const { book_id, page_no = 1 } = useParams()
    const { uid } = useContext(AppContext)
    const [progress, setProgress] = useState(0)
    const [currentVisiblePage, setCurrentVisiblePage] = useState(page_no)
    const [localPageNo, setLocalPageNo] = useState(page_no)
    const [book_info, setBookInfo] = useState({})
    const [gotoPageModal, setGotoPageModal] = useState(false)
    const [settingVisibility, setSettingVisibility] = useState(false)
    const [chaptersVisibility, setChaptersVisibility] = useState(false)

    useEffect(() => {
        // load book info
        getBookById(book_id, uid).then((info) => {
            if (info && info.length > 0) {
                setBookInfo(info[0])
                console.log('book info', info[0])
            }
        })
    }, [])

    // update page url on scroll
    useEffect(() => {
        window.history.replaceState(null, null, `/book/${book_id}/${currentVisiblePage}`);

    }, [currentVisiblePage, book_id])

    const waitBeforeUpdatePage = 500

    // scroll listener
    useEffect(() => {
        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                updatePageView();
            }, waitBeforeUpdatePage);
        };
        let timeout;
        window.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeout);
        };
    })


    // update current page to backend 
    const updatePageView = async () => {
        const parentDiv = document.getElementById('pages');
        const childDivs = parentDiv.children;



        for (const childDiv of childDivs) {
            const isVisible = isElementInViewport(childDiv)

            if (isVisible) {
                // update current page
                setCurrentVisiblePage(parseInt(childDiv.id))
                updateProgressPercent(parseInt(childDiv.id))
                // await setProgressToBackend(book_id, uid, parseInt(childDiv.id))
            }
        }
    }


    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // const scrollTop = document.documentElement.scrollTop;
        // console.log('bottom',scrollTop)

        return (
            rect.top < windowHeight / 2 && rect.bottom > 0
        )
    };

    const updateProgressPercent = (currentPage) => {
        const totalPage = parseInt(book_info.page_no)
        const percent = (currentPage / totalPage) * 100
        setProgress(percent)
    }

    const onClickProgressBar = () => {
        setGotoPageModal(true)
    }

    const onGotoPage = (newPageNo) => {
        window.history.replaceState(null, null, `/book/${book_id}/${newPageNo}`);
        setLocalPageNo(newPageNo)
        setGotoPageModal(false)
    }


    useEffect(() => {
        updateProgressPercent(localPageNo)
    }, [localPageNo, page_no])

    return (
        <Layout>
            <Pagination start={localPageNo} book_info={book_info} />
            <Progress
                format={() => `${currentVisiblePage}`}
                style={{ position: "fixed", bottom: "0", height: "18px" }}
                percent={progress}
                onClick={() => { onClickProgressBar() }}
                size={["100%", 10]}
                // showInfo={false}
                strokeLinecap="square" />
            <GotoPageModal
                onGotoPage={onGotoPage}
                currentPageNo={currentVisiblePage}
                onClose={() => { setGotoPageModal(false) }}
                open={gotoPageModal}
                totalPage={book_info.page_no} />
            {/* sidebar */}
            {/* <SettingsSheet
                visible={settingVisibility}
                setVisibility={setSettingVisibility}
                currentPage={currentPage}
                totalPage={book_info.page_no}
                book_id={book_id} />

            <ChapterList
                loadBookmarks={updateBookmark}
                bookmarks={bookmarks}
                chapters={chapters}
                page_no={currentPage}
                visible={chaptersVisibility}
                setVisibility={setChaptersVisibility}
            /> */}
        </Layout>
    )

}


export function Pages() {
    const scrollOffset = -45
    const waitBeforeUpdatePage = 500
    const { uid } = useContext(AppContext)
    const [contents, setContents] = useState([])
    const [bookData, setBookData] = useState({})
    //
    const [book_info, setBookInfo] = useState({})
    const [bookmarks, setBookmarks] = useState([])
    const [chapters, setChapters] = useState([])
    const [showBadge, setShowBadge] = useState(false)
    const [progess, setProgress] = useState(0)



    const [currentPage, setCurrentPage] = useState(0)
    const [lastPos, setLastPos] = useState(0)
    const { book_id, page_no = 1 } = useParams()


    // initial loading pages
    useEffect(() => {

        // load book info
        getBookById(book_id, uid).then((info) => {
            if (info && info.length > 0) {
                setBookInfo(info[0])
                console.log('book info', info[0])
            }
        }).then(() => {
            // load page 
            getBookPages(book_id, uid, page_no).then((contents) => {
                setContents(contents)
                setCurrentPage(parseInt(page_no))
            })
            // load bookmarks
            updateBookmark()
            updateChapters()
        })

    }, [])

    // useEffect(() => {
    //     getBookPages(book_id, uid, 10, 1).then(res => {
    //         setContents(res)
    //         console.log(res)
    //     })

    //     getBookById(book_id, uid).then(res => {
    //         if (res && res.length > 0) {
    //             setBookData(res[0])
    //         }
    //     })
    // }, [])

    const updateBookmark = () => {
        // getBookmarksFromBackend(uid, book_id).then((res) => {
        //     setBookmarks(res)       
        // })
    }

    const updateChapters = () => {
        // getChaptersFromBackend(book_id).then((res)=>{
        //     setChapters(res)
        // })
    }

    const loadMorePreviousPage = () => {
        console.log("click")
        if (contents.length > 0) {
            const first_page = parseInt(contents[0].page_no)

            if (first_page === 1) return

            const start_from = first_page > page_limit ? first_page - page_limit : 1
            const limit = page_limit < first_page ? page_limit : first_page - 1

            getBookPages(book_id, uid, start_from, limit).then((new_contents) => {
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
            await getBookPages(book_id, uid, last_page).then((new_contents) => {
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
            timeout = setTimeout(() => {
                updatePageView();
            }, waitBeforeUpdatePage);
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
            // message.success('Scroll up to read more')
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
                updateProgressPercent(parseInt(childDiv.id))
                // await setProgressToBackend(book_id, uid, parseInt(childDiv.id))

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

    const updateProgressPercent = (currentPage) => {

        const totalPage = parseInt(book_info.page_no)
        const percent = (currentPage / totalPage) * 100
        console.log('percent', percent)
        console.log('current page', currentPage)
        console.log('total', book_info)
        setProgress(percent)

    }

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

            <Row align="center">
                <Col id="pages" xs={23} md={18} lg={15} xl={12} style={{ minHeight: "100vh" }}>
                    {hasMorePrevious()}
                    {contents.map((content, index) => <Page key={index} content={content} />)}
                    {hasMoreNext()}
                </Col>
            </Row>

            <Progress
                style={{ position: "fixed", bottom: "0", height: "18px" }}
                percent={progess}
                size={["100%", 10]}
                showInfo={false}
                strokeLinecap="square" />
        </>
    )
}