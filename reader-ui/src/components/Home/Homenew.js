
import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeCaps from "./Caps";
import SearchBar from "./SearchBar";
import { AppContext } from "../utils/AppProvider";
import { Paragraph } from "../../App";
import BookList from "./BookList";
import { getAllBookmarksFromBackend, getBookFromBackend, getBookmarksFromBackend, getBooksFromBackend, getCurrentBooksFromBackend, queryBookmarksFromBackend, queryBooksFromBackend } from "../utils/backend";
import { Button, List, Row, Segmented } from "antd";
import { DownOutlined } from "@ant-design/icons";
import BookmarkItem from "./BookmarkItem";
import BookmarkList from "./BookmarkList";

export default function HomeNew() {
  const navigate = useNavigate();
  const { uid, isAdmin, isMobile } = useContext(AppContext);

  const tabs = [
    { title: "Home", key: "1" },
    { title: "Currently reading", key: "2" },
    { title: "All Books", key: "3" },
    { title: "Processing", key: "4" },
    { title: "Bookmarks", key: "5" },

  ];
  // user tab only for admin
  if (isAdmin) tabs.push({ title: "Users", key: "6" })
  const [tabPosition, setTabPosition] = useState(tabs[0].title);

  // list
  const [books, setBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [processingBooks, setProcessingBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [queryBooks, setQueryBooks] = useState([]);
  const [queryBookmarks, setQueryBookmarks] = useState([]);

  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);


  useEffect(() => {
    fetchBooks()

  }, [])

  const fetchBooks = async () => {
    let lastBookId = ""

    if (books && books.length > 0) {
      lastBookId = books[books.length - 1].id
      console.log("id", lastBookId)
      console.log("books", books)
    } else {
      lastBookId = ""
    }

    await getBooksFromBackend(lastBookId, uid).then((res) => {
      setBooks([...books, ...res.books])
      setCount(res.count)
    }).catch(e => {
      console.log(e)
      setBooks([])
    })


    await getCurrentBooksFromBackend(uid,2).then((res) => {

      if (res && res.length > 0) {
        const tmp = []

        for (const item of res) {
          const r = item.result

          if (r && r.length > 0) {
            r[0].settings = [item]
            tmp.push(r[0])
          }
        }
        setCurrentBooks(tmp)
      }

    }).catch(e => {
      console.log(e)
      setBooks([])
    })

    loadBookmarks()
  }

  const loadBookmarks = () => {
    getAllBookmarksFromBackend(uid,2).then(res => {
      setBookmarks(res)
    })
  }

  const onQueryBooks = (newQuery) => {

    if (newQuery) {
      queryBookmarksFromBackend(uid, newQuery).then(res => {

        if (res) {
          setQueryBookmarks(res)
        }
      }).catch(e => {
        setQueryBookmarks([])
      })

      queryBooksFromBackend(newQuery, uid, 10).then(res => {
        setQueryBooks(res)
        console.log("query", res)

      }).catch(e => {
        console.log(e)
        setQueryBooks([])
      })
    } else { setQueryBooks([]) }

    setQuery(newQuery)
  }



  const getTabView = () => {
    if (tabPosition === tabs[0].title) {
      return (
        <>
          <BookList title={`Searching for ${query}`} books={queryBooks} />
          <BookList title="Currently read" books={currentBooks} />
          <BookmarkList bookmarks={bookmarks} loadBookmarks={loadBookmarks}/>
          <BookList title="All Books" books={books} />
          {(count > books.length) &&
            <Row justify="center" align="middle" style={{ margin: "50px" }}>
              <Button onClick={() => { fetchBooks() }}
                type="primary"
                icon={<DownOutlined />}>
                Load more books
              </Button>
            </Row>
          }

        </>
      )
    }
    else if (tabPosition === tabs[1].title) {
      return (
        <BookList title="Currently read" books={currentBooks} />
      )
    }
    else if (tabPosition === tabs[2].title) {
      return (
        <>
          <BookList title="All Books" books={books} />
          {(count > books.length) &&
            <Row justify="center" align="middle" style={{ margin: "50px" }}>
              <Button onClick={() => { fetchBooks() }}
                type="primary"
                icon={<DownOutlined />}>
                Load more books
              </Button>
            </Row>
          }
        </>
      )
    }
    else if (tabPosition === tabs[3].title) {
      return (
        <BookList title="Processing books" books={processingBooks} />
      )
    } else if (tabPosition === tabs[4].title) {
      return (
        <BookmarkList bookmarks={bookmarks} />
      )
    }
  }
  const get_tmp = () => {
    const tmp = []
    tabs.map(i => {
      return tmp.push(i.title)
    })
    return tmp
  }
  return (
    <div>
      <div style={{ margin: "13px" }}>
        <SearchBar onQueryBooks={onQueryBooks} query={query} />
        <Segmented
          style={{
            marginTop: "10px",
            overflow: "scroll",
            width: "95svw",
          }}
          options={get_tmp()}
          onChange={value => { setTabPosition(value) }}
        />

        {getTabView()}
      </div>
    </div>
  );
}
