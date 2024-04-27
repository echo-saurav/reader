import { Skeleton, Space } from "antd";


export default function LoadingBookmarks() {

    return Array.from({ length: 50 }, (_, index) => (
        <Skeleton active loading key={index} />
    ))

}