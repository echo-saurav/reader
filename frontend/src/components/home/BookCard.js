import { BookOutlined, InfoCircleOutlined, StarOutlined } from "@ant-design/icons"
import { App, Button, Flex, Progress, Tag, Typography } from "antd"
import { useNavigate } from "react-router-dom"

export default function BookCard({ id, title, description, cover, page_no, settings }) {
    const navigate = useNavigate()
    const { message, notification, modal } = App.useApp();

    const gotoBookInfoPage = () => {
        if (id) navigate(`/home/bookInfo/${id}`)
    }

    const addToFavorite = () => {
        message.success('Added to Favorite')
    }

    const gotoBookPageView = () => {
        if (id) navigate(`/book/${id}/${getProgress()}`)
    }

    const getProgress = () => {

        if (settings.length > 0 && settings[0].progress) {
            console.log("progress", settings[0].progress)
            return settings[0].progress
        } else {
            return 1
        }
    }

    const getPercent = () => {
        const progress = getProgress();
        if (progress === undefined || progress === 1) return 0;
        return parseFloat(((progress / page_no) * 100).toFixed(1));
    }

    return (
        <div style={{ width: "160px", marginRight: "10px", marginBottom: "20px" }}>

            <img onClick={() => { gotoBookPageView() }} style={{ borderRadius: "10px", width: "100%" }} src={cover} alt="cover" />

            {getPercent() >0 && <Progress size="small" percent={getPercent()} />}
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