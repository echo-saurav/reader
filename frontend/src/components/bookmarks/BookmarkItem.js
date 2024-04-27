import { List, Space } from "antd";

import { useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";


export default function BookmarkItem({
    cover,
    minimal = false,
    page_no,
    title,
    text,
    book_id,
    onDelete,
    onEdit }) {

    const navigate = useNavigate()

    const onClick = () => {
        // navigate(`/book/${book_id}/${page_no}`)
    }
    return (
        <List.Item
            actions={[
                <Space onClick={() => { onDelete(book_id, page_no) }}
                    style={{ cursor: "pointer" }} >
                    <DeleteOutlined />
                    Delete
                </Space>,
                <Space onClick={() => { onEdit(text, book_id, page_no) }}
                    style={{ cursor: "pointer" }} >
                    <EditOutlined />
                    Edit
                </Space>
            ]}
        >

            <List.Item.Meta
                onClick={() => { onClick() }}
                // title={text? text :book_info[0].name }
                title={title ? title : "empty title"}
                description={text ? text.slice(0, 300) : "no description"}
                avatar={!minimal &&
                    <img
                        alt="cover"
                        width={50}
                        src={cover}
                    />
                }
            />
        </List.Item>
    )
}