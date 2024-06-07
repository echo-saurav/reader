import { ArrowLeftOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";



export default function NotFound() {
    return (
        <Flex justify="center" align="center" style={{ minHeight: "100svh" }}>
            <Flex justify="center" align="center">
                <Flex vertical align="center">
                    <Typography.Title>Page not found</Typography.Title>
                     <Typography.Link href="/"> <ArrowLeftOutlined/> go to home to read books </Typography.Link>
                </Flex>
            </Flex>
        </Flex>
    )
}