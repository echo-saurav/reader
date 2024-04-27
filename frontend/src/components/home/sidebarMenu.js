import { BookOutlined, HomeOutlined, SettingOutlined, StarOutlined } from "@ant-design/icons"
import { Menu, Typography } from "antd"
import { useNavigate } from "react-router-dom"


export default function SidebarMenu() {
    const navigate = useNavigate()
    return (
        <>
            <Typography.Title
                onClick={() => { navigate("/home") }}
                style={{ margin: "20px", cursor: "pointer" }}
                level={3}>
                Reader
            </Typography.Title>
            <Menu
                onClick={(v) => { navigate(v.key) }}
                style={{ background: "transparent", borderRight: "none" }}
                mode="vertical"
                items={[
                    { key: '/home/', label: "Home", icon: <HomeOutlined /> },
                    { key: '/home/bookmarks', label: "Bookmarks", icon: <BookOutlined /> },
                    { key: '/home/favorites', label: "Favorite", icon: <StarOutlined /> },
                    { key: '/home/settings', label: "Setting", icon: <SettingOutlined /> },
                ]} />
        </>

    )
}