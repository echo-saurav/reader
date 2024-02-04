import { Image, Space } from "antd";
import { API } from "../utils/Variables";


export default function BookmarkItem({ book_id, page_no, text }) {
    return (
        <Space direction="vertical">
            <h3>{text}</h3>
            <p>Page: {page_no}</p>
            <Image
                width={100}
                src={`${API}/book/image/${book_id}/0/t`} />
        </Space>
    )
}