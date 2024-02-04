
import { useContext, useEffect, useState } from 'react';
import {
  getAllBookmarksFromBackend, getBooksFromBackend, getCurrentBooksFromBackend,
  queryBookmarksFromBackend, queryBooksFromBackend
} from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../utils/AppProvider';
import HomeCaps from './Caps';
import BookItem from './BookItem';
import BookmarkItem from './BookmarkItem';
import { Affix, Divider, Flex, Input, Space } from 'antd';
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { Title } from '../../App';

export default function Home() {
  const [tabPosition, setTabPosition] = useState(0)
  const [books, setBooks] = useState([])
  const [currentBooks, setCurrentBooks] = useState([])

  const [queryBooks, setQueryBooks] = useState([])
  const [queryBookmarks, setQueryBookmarks] = useState([])
  const [bookmarks, setBookmarks] = useState([])

  const [query, setQuery] = useState("")
  const [count, setCount] = useState(0)
  const { uid, isAdmin } = useContext(AppContext)
  const navigate = useNavigate()

  const tabs = isAdmin ? [ // user tab only for admin
    { "title": "Home" },
    { "title": "Currently reading" },
    // { "title": "Unread Books" },
    { "title": "All Books" },
    { "title": "Processing" },
    { "title": "Bookmarks" },
    { "title": "Users" }
  ]
    : [
      { "title": "Home" },
      { "title": "Currently reading" },
      // { "title": "Unread Books" },
      { "title": "All Books" },
      { "title": "Processing" },
      { "title": "Bookmarks" },

    ]


  const fetchBooks = async () => {
    // get last book id for pagination
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

    await getCurrentBooksFromBackend(uid).then((res) => {
      console.log(res)

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

    await getAllBookmarksFromBackend(uid).then(res => {
      console.log("bookmarks", res)
      setBookmarks(res)
    })
  }

  const onQueryBooks = (newQuery) => {

    if (newQuery) {
      queryBookmarksFromBackend(uid, newQuery).then(res => {
        console.log(res)
        if (res) {
          setQueryBookmarks(res)
        }
      }).catch(e => {
        setQueryBookmarks([])
      })
      queryBooksFromBackend(newQuery, uid, 10).then(res => {
        setQueryBooks(res)

      }).catch(e => {
        console.log(e)
        setQueryBooks([])
      })
    } else { setQueryBooks([]) }

    setQuery(newQuery)
  }

  const isStartedReading = (book) => {
    if (!book.settings || !book.settings.length > 0) {
      return false
    } else if (book.settings[0].progress === 0) {
      return false
    } else if (book.settings[0].progress > 1) {
      return true
    }
    return false
  }

  const isProcessing = (book) => {
    if (!book.processing) {
      return false
    } else if (parseInt(book.processing) > 0) {
      return true
    }
    return false
  }
  const getFilteredBooks = () => {
    // home
    if (tabPosition === 0) {
      return books.map((item, index) => (
        <BookItem item={item} index={index} key={index} />
      ))
    }
    // read
    else if (tabPosition === 1) {
      return currentBooks.map((item, index) => (
        <BookItem item={item} index={index} key={index} />
      ))
    }
    // unread
    // else if (tabPosition === "2") {
    //   return unreadBooks
    // }
    // all
    else if (tabPosition === 2) {
      return books
    }
    // processing
    else if (tabPosition === 3) {
      return books.filter(item => isProcessing(item))
    }
    // bookmarks
    else if (tabPosition === 4) {
      return bookmarks.map((item, index) => (
        <BookmarkItem book_id={item.book_id}
          page_no={item.page_no}
          text={item.text}
          key={index} />
      ))

    }
    return []
  }


  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div style={{ padding: "10px" }} >
      <Affix offsetTop={10} style={{ marginBottom: "10px" }}>
        <Flex>
          <Input
            size='large'
            onChange={(e) => { onQueryBooks(e.target.value) }}
            value={query}
            placeholder='Search books, bookmarks and also text'
            prefix={<SearchOutlined />}
            suffix={
              <MenuOutlined
                onClick={() => { navigate("/settings") }} />
            }
          />
        </Flex>
      </Affix>

      {/* books */}

      <HomeCaps tabs={tabs} activeKey={tabPosition} onChange={setTabPosition} />

      {tabPosition === 0 ?
        // for home

        <Space direction='vertical' >

          {queryBooks.length > 0 && <>
            <Title level={2}>Searching for {query}</Title>
            <Space align='start' size={10} wrap>
              {queryBooks
                .map((item, index) => (
                  <BookItem item={item} index={index} key={index} />
                ))}
            </Space>
          </>}

          {currentBooks && <>
            <Title level={2}>Last Read </Title>
            <Space align='start' size={10} wrap>
              {currentBooks
                .map((item, index) => (
                  <BookItem item={item} index={index} key={index} />
                ))}
            </Space>
          </>}


          <Divider />
          <Title level={2}>All Books</Title>
          <div>
            <Space align='start' size={10} wrap>
              {books.map((item, index) => (
                <BookItem item={item} index={index} key={index} />
              ))}
            </Space>

            {/* <InfiniteScroll
              threshold={0}
              loadMore={() => { return fetchBooks() }}
              hasMore={count > books.length} >
              {count > books.length ? <h1>Loading</h1> : <h1>End page</h1>}
            </InfiniteScroll> */}
          </div>

        </Space> :

        // for other tab
        <Space align='start' size={10} wrap>
          {getFilteredBooks()}
        </Space>
      }
    </div>
  );
}
