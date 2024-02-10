import { useContext, useEffect, useState } from "react";
import { getBookFromBackend, getPageFromBackend, page_limit, saveBookmarkToBackend, setProgressToBackend } from "../utils/backend";
import { useNavigate, useParams } from "react-router-dom";
import SettingsSheet from "./SettingsSheet";
import { AppContext } from "../utils/AppProvider";
import Page from "./Page";
import { API } from "../utils/Variables";
import BookmarkModal from "./BookmarkModal";
import { Affix, Badge, Button, Card, Drawer, Flex, Image, Row, Space } from "antd";
import { Paragraph, Text, Title } from "../../App";
import { ArrowLeftOutlined, BookOutlined, LeftOutlined, SearchOutlined, SettingOutlined, UpOutlined } from "@ant-design/icons";
import ChapterList from "./ChapterList";

export default function Book() {
  const scrollOffset = -45
  const [contents, setContents] = useState([])
  const [book_info, setBookInfo] = useState({})
  const [lastPos, setLastPos] = useState(0)
  const [settingVisibility, setSettingVisibility] = useState(false)
  const [chaptersVisibility, setChaptersVisibility] = useState(false)
  const [bookmarkPopupVisible, setBookmarkPopupVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const { book_id, page_no = 1 } = useParams()

  const { isDarkTheme, isMobile, uid, showToast } = useContext(AppContext)

  // image viewer
  const [imageViewerSrc, setImageViewerSrc] = useState(null)
  const navigate = useNavigate()

  // initial loading pages
  useEffect(() => {

    getBookFromBackend(book_id, uid).then((info) => {
      if (info && info.length > 0) {
        setBookInfo(info[0])
      }

    }).then(() => {

      getPageFromBackend(book_id, page_no).then((contents) => {
        setContents(contents)
        setCurrentPage(parseInt(page_no))

      })
    })


  }, [])

  // update current page to backend 
  const updatePageView = () => {

    const parentDiv = document.getElementById('pages');
    const childDivs = parentDiv.children;


    for (const childDiv of childDivs) {
      const isVisible = isElementInViewport(childDiv)

      if (isVisible) {
        setCurrentPage(parseInt(childDiv.id))
        setProgressToBackend(book_id, uid, parseInt(childDiv.id))

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



  // scroll listener
  useEffect(() => {

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => { updatePageView(); }, 500);
    };

    let timeout;

    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };

  }, [])


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



  const loadMorePage = async () => {
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

  const loadMorePreviousPage = () => {
    if (contents.length > 0) {
      const first_page = parseInt(contents[0].page_no)

      if (first_page === 1) return

      const start_from = first_page > page_limit ? first_page - page_limit : 1
      const limit = page_limit < first_page ? page_limit : first_page - 1

      getPageFromBackend(book_id, start_from, limit).then((new_contents) => {
        setContents([...new_contents, ...contents])
        setLastPos(first_page)

      })
    }
  }

  const hasMore = () => {
    if (contents.length > 0) {
      const last_page = parseInt(contents[contents.length - 1].page_no)

      if (book_info.page_no > last_page) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  const hasMorePrevious = () => {
    if (contents.length > 0) {
      const first_page = parseInt(contents[0].page_no)
      if (first_page === 1) {
        return false
      }
      return true
    }
    return false
  }

  const scrollInto = (key) => {
    const divToScrollTo = document.getElementById(key);
    if (divToScrollTo) {
      divToScrollTo.scrollIntoView();
      window.scrollBy(0, scrollOffset)
      showToast("info", 'Scroll up to read more')

    }
  }


  const onBookmarkPage = () => {
    saveBookmarkToBackend("", uid, book_id, currentPage).then(res => {

      if (res) {
        showToast("success", `Page ${currentPage} Bookmark added!`)
      } else {
        showToast("error", "Error saving bookmark")
      }
    }).catch(e => {
      showToast("error", "Error saving bookmark")
    })

  }

  return (
    <>
      <Affix offsetTop={10}>
        <Flex justify="start" style={{ padding: "10px" }}>
          <Button style={{ marginRight: "5px" }} shape="circle" icon={<LeftOutlined />} />
          <Flex justify="end" style={{ flex: 1 }} >
            <Badge dot={true}>
              <Button onClick={() => { setChaptersVisibility(true) }}
                style={{ marginLeft: "5px" }} shape="circle" icon={<BookOutlined />} />
            </Badge>
            <Button style={{ marginLeft: "5px" }}
              shape="circle" icon={<SearchOutlined />} />
            <Button onClick={() => { setSettingVisibility(true) }}
              style={{ marginLeft: "5px" }} shape="circle" icon={<SettingOutlined />} />
          </Flex>
        </Flex>
      </Affix>
      <div className="container" >

        <SettingsSheet
          visible={settingVisibility}
          setVisibility={setSettingVisibility}
          currentPage={currentPage}
          totalPage={book_info.page_no}
          book_id={book_id} />

        <BookmarkModal
          setVisible={setBookmarkPopupVisible}
          book_id={book_id}
          page_no={parseInt(currentPage)}
          visible={bookmarkPopupVisible} />

        <ChapterList
          book_id={book_id}
          page_no={parseInt(currentPage)}
          visible={chaptersVisibility}
          setVisibility={setChaptersVisibility}
        />


        {(contents.length > 0 && contents[0].page_no === 1)
          && <div style={{ paddingTop: "100px" }}>
            <Title>{book_info.name}</Title>
            <Text type="secondary" strong>{book_info.description}</Text>
            <Image preview={false} src={`${API}/${book_info.cover}`} />
          </div>}


        {hasMorePrevious() &&
          <Row justify="center" align="middle">

            <Button
              type="primary"
              icon={<UpOutlined />}
              size="small"
              style={{ marginTop: "70px" }}
              id="loadMoreButton"
              onClick={() => { loadMorePreviousPage() }}

            >Load previous pages</Button>
          </Row>

        }


        <div id="pages">
          {contents.map((content, index) =>
            <Page
              key={index}
              content={content}
              onShowImage={setImageViewerSrc}
            />)}
        </div>

        {/* <InfiniteScroll
          threshold={2000}
          loadMore={() => { return loadMorePage() }}
          hasMore={hasMore()} >
          {hasMore() ? <h1>Loading</h1> : <h1>End page</h1>}
        </InfiniteScroll> */}

        <div style={{
          width: "100dvw", position: "fixed",
          bottom: "0", left: "0",
        }}>
          <Paragraph>
            {currentPage}/{book_info.page_no}
          </Paragraph>
        </div>

      </div>
    </>
  );
}

