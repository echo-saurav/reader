import { Space } from "antd";
import { Title } from "../../App";
import BookItem from "./BookItem";


export default function BookList({ title, books }) {
    return (
        (books && books.length > 0) &&
        <>
            <Title level={2}>{title}</Title>
            <Space align='start' size={10} wrap>
                {books
                    .map((item, index) => (
                        <BookItem item={item} index={index} key={index} />
                    ))}
            </Space>
        </>
    )
}