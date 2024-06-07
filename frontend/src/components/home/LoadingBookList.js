import { Skeleton, Space } from "antd";


export default function LoadingBookList({ length = 50 }) {

    return <Space wrap>

        {Array.from({ length: length }, (_, index) => (
            <Skeleton active loading style={{ width: "180px" }} key={index} />
        ))}
    </Space>
}