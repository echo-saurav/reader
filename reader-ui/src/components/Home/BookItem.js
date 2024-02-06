import { useNavigate } from "react-router-dom"
import { API } from "../utils/Variables"
import { Card, Progress } from "antd"

import { Paragraph, Title } from "../../App"


export default function BookItem({ item, index }) {
    const navigate = useNavigate()
    const goToBook = (settings, book_id) => {
        console.log(settings)
        console.log(book_id)
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

        <Card hoverable={false}
            size="small"
            onClick={() => { goToBook(item.settings, item._id.$oid) }}
            style={{ width: 170 }}
            cover={
                <>
                    <img
                        alt="cover"
                        src={`${API}/${item.cover}/t`} />
                    <Progress
                        style={{ lineHeight: "0" }}
                        strokeLinecap="square"
                        percent={getProgress(item.settings, item.page_no)}
                        showInfo={false} />
                </>
            }>

            <Title style={{ margin: "0" }} level={5}>
                {item.name}
            </Title>
            {item.description && <Paragraph>
                {item.description}
            </Paragraph>}

        </Card>



    )
}