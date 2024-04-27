import { Skeleton, Space } from "antd";


export default function LoadingBookList() {

    return <Space wrap>

        {Array.from({ length: 50 }, (_, index) => (
            <Skeleton active loading style={{ width: "180px" }} key={index} />
        ))}
    </Space>
}