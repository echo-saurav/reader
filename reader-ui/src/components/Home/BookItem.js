import { Ellipsis, Image, ProgressBar } from "antd-mobile"
import { useNavigate } from "react-router-dom"
import { API } from "../utils/Variables"


export default function BookItem({ item, index }) {
    const navigate = useNavigate()
    const goToBook = (settings, book_id) => {
        if (settings && settings[0] && settings[0].progress && book_id) {
            navigate(`/book/${book_id}/${settings[0].progress}`)
        } else if (book_id) {
            navigate(`/book/${book_id}`)
        }
    }

    const getProgress = (settings, totalPage) => {
        if (settings && settings[0] && settings[0].progress) {
            return parseInt(settings[0].progress) / parseInt(totalPage) * 100
        } else {
            return 0
        }
    }
    
    return (
        <div key={index} onClick={() => { goToBook(item.settings, item.id) }}
             style={{ width: "140px", padding: "10px", overflow: "hidden" }}>

            <Image src={`${API}/${item.cover}/t`} />
            <ProgressBar percent={getProgress(item.settings, item.page_no)} rounded={false} />
            <p style={{ margin: '3px' }} >total page: {item.page_no}</p>
            <h3 style={{ margin: '0' }}>{item.name}</h3>
            <Ellipsis direction='end' content={item.description} rows={3} />

        </div>
    )
}