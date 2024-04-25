import { Card, Flex, Layout, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { getBooksFromBackend, getTest } from "../utils/backend";


export default function Home() {
    const [books, setBooks] = useState([])
    useEffect(() => {
        getBooksFromBackend(null, null, 100)
            .then(res => {
                setBooks(res.books)
                console.log(res)
            })
    }, [])

    return (
        <Layout>
            <Typography.Title>Welcome</Typography.Title>
            <Space wrap>
                {books.map(((v, k) =>
                    <Card
                        hoverable
                        style={{ width: "180px", margin: "5px" }}
                        key={k}
                        cover={
                            <img
                                alt={v.google_info.title}
                                src={v.google_info.smallThumbnail}
                            />}
                    >
                        <Typography.Title style={{margin:0}} level={5}>{v.google_info.title}</Typography.Title>
                        <Typography.Text style={{margin:0}} type="secondary">
                            {
                                v.google_info.description ?
                                    v.google_info.description.slice(0, 50) :
                                    v.google_info.subtitle.slice(0, 50)
                            }
                        </Typography.Text>
                    </Card>
                ))}

            </Space>
        </Layout>
    )
}