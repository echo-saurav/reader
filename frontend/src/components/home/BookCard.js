import { BookOutlined, InfoCircleOutlined, StarOutlined } from "@ant-design/icons"
import { App, Button, Flex, Progress, Tag, Typography } from "antd"
import { useNavigate } from "react-router-dom"

export default function BookCard({ id, title, description, cover, progress }) {
    const navigate = useNavigate()
    const { message, notification, modal } = App.useApp();

    const gotoBookInfoPage = () => {
        if (id && progress) navigate(`/home/bookInfo/${id}/${progress}`)
        if (id) navigate(`/home/bookInfo/${id}`)
    }

    const addToFavorite = () => {
        message.success('Added to Favorite')
    }

    const gotoBookPageView = () => {
        if (id) navigate(`/book/${id}`)
    }


    return (
        <div style={{ width: "160px", marginRight: "10px", marginBottom: "20px" }}>

            <img onClick={() => { gotoBookPageView() }} style={{ borderRadius: "10px", width: "100%" }} src={cover} alt="cover" />

            <Progress size="small" percent={34} />
            <Typography.Title level={5} style={{ margin: "3px" }} >{title ? title : "empty book name"}</Typography.Title>

            <Flex gap="4px 0" wrap="wrap">
                {["Science", "Selfhelp", "Science",].map((v, k) => <Tag key={k}>{v}</Tag>)}
            </Flex>
            <Button.Group style={{ margin: "10px 0px", }}>
                <Button onClick={() => { gotoBookInfoPage() }} icon={<InfoCircleOutlined />} />
                <Button onClick={() => { gotoBookPageView() }} icon={<BookOutlined />} />
                <Button onClick={() => { addToFavorite() }} icon={<StarOutlined />} />

            </Button.Group>

            <Typography.Paragraph type="secondary" level={4} style={{ margin: "3px" }} >
                {description ? description.slice(0, 200) : ""}
            </Typography.Paragraph>


        </div>
    )
}