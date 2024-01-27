import { useContext, useEffect, useState } from "react";
import { getBookFromBackend, getPageFromBackend, page_limit, setProgressToBackend } from "../utils/backend";
import { useNavigate, useParams } from "react-router-dom";
import { AutoCenter, Button, FloatingPanel, Image, ImageViewer, InfiniteScroll, Input, List, NavBar, Popup, Space, Toast } from "antd-mobile";
import "./Book.css"
import { UpOutline } from "antd-mobile-icons";
import SettingsSheet from "./SettingsSheet";
import { AppContext } from "../utils/AppProvider";
import Page from "./Page";
import { API } from "../utils/Variables";

export default function Book() {
  const scrollOffset = -45
  const [contents, setContents] = useState([])
  const [book_info, setBookInfo] = useState({})
  const [lastPos, setLastPos] = useState(0)
  const [popupVisible, setPopupVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const { book_id, page_no = 1 } = useParams()

  const { isDarkTheme, isMobile, uid } = useContext(AppContext)

  // image viewer
  const [imageViewerSrc, setImageViewerSrc] = useState(null)
  const navigate = useNavigate()

  // initial loading pages
  useEffect(() => {

    getBookFromBackend(book_id, uid).then((info) => {
      if (info && info.length > 0) {
        setBookInfo(info[0])
        console.log(info[0])

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

      Toast.show({
        content: 'Scroll up to read more',
        position: 'top',
        icon: <UpOutline />
      })
    }
  }

  const goToPage = () => {
    setPopupVisible(!popupVisible)
    console.log("click")
  }



  return (
    <div className="container" >
      <Popup visible={popupVisible}
        onMaskClick={() => {
          setPopupVisible(false)
        }}
        onClose={() => {
          setPopupVisible(false)
        }}
        position={isMobile ? "bottom" : 'right'}
        bodyStyle={{ height: isMobile ? '50dvh' : '100dvh' }}
      >
        <SettingsSheet currentPage={currentPage}
          totalPage={book_info.page_no}
          setPopupVisible={setPopupVisible}
          book_id={book_id} />

      </Popup>



      {(contents.length > 0 && contents[0].page_no === 1)
        && <div style={{ paddingTop: "100px" }}>
          <h1>{book_info.name}</h1>
          <p>{book_info.description}</p>
          <Image src={`${API}/${book_info.cover}`} />
        </div>}


      {hasMorePrevious() &&
        <AutoCenter>

          <Button
            shape="rounded"
            size="small"
            style={{ marginTop: "70px" }}
            id="loadMoreButton"
            onClick={() => { loadMorePreviousPage() }}
            color='primary'
          >Load previous pages</Button>
        </AutoCenter>
      }

      <div id="pages">

        {contents.map((content, index) =>
          <Page
            key={index}
            content={content}
            onShowImage={setImageViewerSrc}
          />)}
      </div>

      <InfiniteScroll
        threshold={2000}
        loadMore={() => { return loadMorePage() }}
        hasMore={hasMore()} >
        {hasMore() ? <h1>Loading</h1> : <h1>End page</h1>}
      </InfiniteScroll>

      <div style={{
        width: "100dvw", position: "fixed",
        bottom: "0", left: "0",
        opacity: ".7",
        background: isDarkTheme ? "black" : "white",
      }}>
        <p onClick={() => { goToPage() }}
          style={{
            margin: "0", textAlign: "right",
            padding: "3px", cursor: "pointer",
            fontWeight: "bold"

          }}>
          Page: {currentPage}/{book_info.page_no}
        </p>
      </div>
      <ImageViewer
        onClose={() => { setImageViewerSrc(null) }}
        image={imageViewerSrc}
        visible={imageViewerSrc ? true : false} />

      <div style={{ position: "fixed", top: '0', width: '100%', left: '0', background: 'var(--adm-color-background)' }}>
        <NavBar onBack={() => { navigate("/") }}
          style={{}}>
          {book_info.name}
        </NavBar>
      </div>
    </div>
  );
}

