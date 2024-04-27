import { Button, Flex, Progress, Tag, Typography } from "antd"

export default function BookCard({ title, description, cover }) {
    return (
        <div
            style={{ width: "160px", marginRight: "10px", marginBottom: "20px" }}
        >

            <img style={{ borderRadius: "10px", width: "100%" }} src={cover} alt="cover" />

            <Progress size="small" percent={34} />
            <Typography.Title level={4} style={{ margin: "3px" }} >{title ? title : "empty book name"}</Typography.Title>

            <Flex gap="4px 0" wrap="wrap">
                {["Science", "Selfhelp", "Science",].map((v, k) => <Tag key={k}>{v}</Tag>)}
            </Flex>
            <Button.Group size="small" style={{ margin: "10px 0px", }}>
                <Button >Edit</Button>
                <Button>Add to collection</Button>
            </Button.Group>

            <Typography.Paragraph type="secondary" level={4} style={{ margin: "3px" }} >
                {description ? description.slice(0, 200) : ""}
            </Typography.Paragraph>


        </div>
    )
}