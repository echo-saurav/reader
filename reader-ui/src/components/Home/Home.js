import { Button, PullToRefresh, SearchBar, Space } from 'antd-mobile'
import { useContext, useEffect, useState } from 'react';
import { getBooksFromBackend } from '../utils/backend';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutline } from 'antd-mobile-icons';
import { AppContext } from '../utils/AppProvider';
import HomeCaps from './Caps';
import BookItem from './BookItem';

export default function Home() {
  const [tabPosition, setTabPosition] = useState('0')
  const [books, setBooks] = useState([])
  const { uid } = useContext(AppContext)

  const navigate = useNavigate()
  const tabs = [
    { "title": "Home" },
    { "title": "Read Books" },
    { "title": "Unread Books" },
    { "title": "All Books" },
    { "title": "Processing" },
    { "title": "Bookmarks" },
    { "title": "Users" }
  ]


  const fetchBooks = async () => {
    // get last book id for pagination
    let lastBookId = ""

    if (books && books.length > 0) {
      lastBookId = books[books.length - 1].book_id
    } else {
      lastBookId = ""
    }

    getBooksFromBackend(lastBookId, uid).then((res) => {
      setBooks(res)
    })
  }

  const isStartedReading = (book) => {
    if (!book.settings || !book.settings.length > 0) {
      return false
    } else if (book.settings[0].progress === 0) {
      return false
    } else if (book.settings[0].progress > 0) {
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
    if (tabPosition === "0") {
      return books
    }
    // read
    else if (tabPosition === "1") {
      return books.filter(item => isStartedReading(item))
    }
    // unread
    else if (tabPosition === "2") {
      return books.filter(item => !isStartedReading(item))
    }
    // all
    else if (tabPosition === "3") {
      return books
    }
    // processing
    else if (tabPosition === "4") {
      return books.filter(item => isProcessing(item))
    }
    return []
  }


  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div style={{ padding: "10px" }}>
      <PullToRefresh
        onRefresh={async () => {
          console.log("refresh")
          await fetchBooks()
        }}
        renderText={status => <h3>Refreshing...</h3>}
      >
        {/* Top bar */}
        <div style={{
          position: "fixed", top: '0', width: '100%', left: '0',
          display: "flex", background: 'var(--adm-color-background)'
        }}>
          <SearchBar placeholder='search books and text' style={{ padding: "10px", flex: '1' }} />
          <Button
            onClick={() => { navigate("/settings") }}
            size='small' style={{ margin: "10px" }} color='primary'>
            <AppstoreOutline />
          </Button>
        </div>

        {/* books */}
        <div style={{ marginTop: "40px" }}>
          <HomeCaps tabs={tabs} activeKey={tabPosition} onChange={setTabPosition} />


          {tabPosition === "0" ?
            // for home


            <Space direction='vertical' >
              <h1>Last read</h1>
              <Space block wrap direction='horizontal'>

                {/* {getFilteredBooks().map((item, index) => (
                <BookItem item={item} index={index} key={index} />
              ))} */}
                {books.filter(item => isStartedReading(item))
                  .map((item, index) => (
                    <BookItem item={item} index={index} key={index} />
                  ))}
              </Space>

              <h1>New books</h1>
              <Space block wrap direction='horizontal'>

                {/* {books.filter(item => isStartedReading(item))
                .slice(4)
                .map((item, index) => (
                  <BookItem item={item} index={index} key={index} />
                ))} */}
                {books.map((item, index) => (
                  <BookItem item={item} index={index} key={index} />
                ))}
              </Space>
            </Space> :
            // for other tab
            <Space wrap block >
              {getFilteredBooks().map((item, index) => (
                <BookItem item={item} index={index} key={index} />
              ))}
            </Space>

          }
        </div>

      </PullToRefresh>
    </div>
  );
}