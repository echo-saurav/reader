import { Button, Col, Descriptions, Divider, Flex, Layout, Row, Space, Tag, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { getBookById } from "../utils/backend";
import { useParams } from "react-router-dom";
import { AppContext } from "../utils/AppProvider";
import { BookOutlined, SearchOutlined, StarOutlined } from "@ant-design/icons";
import Bookmarks from "./bookmarks/Bookmarks";



export default function BookInfo() {

    const { book_id } = useParams()
    const { uid } = useContext(AppContext)
    const [bookData, setBookData] = useState({})


    useEffect(() => {
        getBookById(book_id, uid).then(res => {
            if (res && res.length > 0) {
                setBookData(res[0])
                window.scrollTo(0,0)
                console.log("bookdata", res)
            }
        })
    }, [])

    return <div>

        <Row style={{ padding: "10px", maxWidth: "1200px" }} >
            <Col xs={24} sm={24} md={8} xl={7} style={{ padding: "10px" }}>
                <Flex justify="center" align="center"  vertical >
                    <img
                        style={{ borderRadius: "10px", marginBottom: "20px" , minWidth:"200px", maxWidth:"300px"}}
                        src={bookData.google_info && bookData.google_info.thumbnail}
                        alt={bookData.filename} />
                    <Button.Group style={{width:"90%"}}>
                        {/* <Button icon={<BookOutlined />} block>Read</Button>
                        <Button icon={<StarOutlined />} block>Favorite</Button>
                        <Button icon={<SearchOutlined />} block>Scan</Button> */}
                        <Button icon={<BookOutlined />} block></Button>
                        <Button icon={<StarOutlined />} block></Button>
                        <Button icon={<SearchOutlined />} block></Button>

                    </Button.Group>
                </Flex>

            </Col>
            <Col md={15} xl={13} style={{ padding: "10px" }}>
                <BookInfoView
                    title={bookData.google_info ? bookData.google_info.title : bookData.filename}
                    authors={bookData.google_info ? bookData.google_info.authors : []}
                    description={bookData.google_info && bookData.google_info.description}
                    path={bookData.path}
                    filename={bookData.filename}
                    categories={bookData.google_info ? bookData.google_info.categories : []}
                    pageNo={bookData.page_no}
                    publisher={bookData.google_info && bookData.google_info.publisher}
                    thumbnail={bookData.google_info && bookData.google_info.thumbnail}
                    lang={bookData.google_info && bookData.google_info.lang}
                    subtitle={bookData.google_info && bookData.google_info.subtitle}
                    publishedDate={bookData.google_info && bookData.google_info.publishedDate}
                />
            </Col>
        </Row>
        <Bookmarks/>
    </div>

}




function BookInfoView({
    title,
    authors,
    description,
    path,
    filename,
    categories,
    pageNo,
    publisher,
    thumbnail,
    lang,
    subtitle,
    publishedDate
}) {

    return <div style={{ padding: "0px" }}>

        <Typography.Title style={{ margin: "0px 0px 20px 0px" }} level={3}>{title ? title : filename}</Typography.Title>

        <Descriptions column={1}>

            <Descriptions.Item label="Book Name">{title ? title : filename}</Descriptions.Item>
            {description && <Descriptions.Item label="Description">{description}</Descriptions.Item>}
            {authors && <Descriptions.Item label="Authors">
                <Space wrap>
                    {authors.map((v, k) => <Typography.Text key={k}>{v}</Typography.Text>)}
                </Space>
            </Descriptions.Item>}
            {subtitle && <Descriptions.Item label="Subtext">{subtitle}</Descriptions.Item>}

            {path && <Descriptions.Item label="Path on host">{path}</Descriptions.Item>}
            {filename && <Descriptions.Item label="File name">{filename}</Descriptions.Item>}
            {pageNo && <Descriptions.Item label="Page no">{pageNo}</Descriptions.Item>}
            {publisher && <Descriptions.Item label="Publisher">{publisher}</Descriptions.Item>}
            {publishedDate && <Descriptions.Item label="Published Date">{publishedDate}</Descriptions.Item>}
            {lang && <Descriptions.Item label="Language">{lang}</Descriptions.Item>}
            {categories && <Descriptions.Item label="Categories">
                <Space wrap>
                    {categories.map((v, k) => <Tag key={k}>{v}</Tag>)}
                </Space>
            </Descriptions.Item>}
        </Descriptions>
    </div>
}