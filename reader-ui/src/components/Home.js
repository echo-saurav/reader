import { Button, Divider, Ellipsis, Image, ProgressBar, PullToRefresh, SearchBar, Space, Tag } from 'antd-mobile'
import { useContext, useEffect, useState } from 'react';
import { getBooksFromBackend } from './utils/backend';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutline } from 'antd-mobile-icons';
import { API } from './utils/Variables';
import { AppContext } from './utils/AppProvider';

export default function Home() {

  const [books, setBooks] = useState([])
  const navigate = useNavigate()
  const { uid } = useContext(AppContext)

  useEffect(() => {
    update()
  }, [])

  const update = async () => {
    getBooksFromBackend("", uid).then((res) => {
      console.log("books", res)
      setBooks(res)
    })
  }

  const goToBook = (settings, book_id) => {
    if (settings && settings[0] && settings[0].progress && book_id) {
      navigate(`/book/${book_id}/${settings[0].progress}`)
    } else if (book_id) {
      navigate(`/book/${book_id}`)
    }
  }

  const getProgress = (settings, totalPage) => {
    if (settings && settings[0] && settings[0].progress) {
      return  parseInt(settings[0].progress)/parseInt(totalPage)  * 100
    } else {
      return 0
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <PullToRefresh
        onRefresh={async () => {
          console.log("refresh")
          await update()
        }}
        renderText={status => <h3>Refreshing...</h3>}
      >
        <div style={{
          position: "fixed", top: '0', width: '100%', left: '0',
          display: "flex", background: 'var(--adm-color-background)'
        }}>

          <SearchBar placeholder='search books' style={{ padding: "10px", flex: '1' }} />
          <Button
            onClick={() => { navigate("/settings") }}
            size='small' style={{ margin: "10px" }} color='primary'>
            <AppstoreOutline />
          </Button>
        </div>
        <div style={{ marginTop: "40px" }}>
          <h1 style={{ margin: "0" }}>All Books</h1>
          <Divider />
          <Space wrap block >

            {books.map((item, index) => (
              <div
                onClick={() => { goToBook(item.settings, item.id) }}
                key={index} style={{ width: "140px", padding: "10px" , overflow:"hidden"}}>
                <Image src={`${API}/${item.cover}`} />
                <ProgressBar percent={getProgress(item.settings, item.page_no)} rounded={false} />
                <p  style={{ margin: '3px' }} >total page: {item.page_no}</p>
                <h3 style={{ margin: '0' }}>{item.name}</h3>
                <Ellipsis direction='end' content={item.description} rows={3} />
              </div>
            ))}
          </Space>
        </div>

      </PullToRefresh>
    </div>
  );
}
