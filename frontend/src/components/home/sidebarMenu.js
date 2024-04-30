import { BookOutlined, ClockCircleOutlined, HomeOutlined, SettingOutlined, StarOutlined } from "@ant-design/icons"
import { Menu, Typography } from "antd"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../../utils/AppProvider"


export default function SidebarMenu() {
    const navigate = useNavigate()
    const {isDarkTheme}=useContext(AppContext)
    return (
        <>
            {/* <Typography.Title
                onClick={() => { navigate("/home") }}
                style={{ margin: "20px", cursor: "pointer" }}
                level={3}>
                Reader
            </Typography.Title> */}
            <Menu
                theme={isDarkTheme?"dark":"light"}
                onClick={(v) => { navigate(v.key) }}
                style={{   borderRight: "none", marginTop:"30px" }}
                mode="vertical"
                items={[
                    { key: '/home/', label: "Home", icon: <HomeOutlined /> },
                    { key: '/home/currentlyReading', label: "Currently Reading", icon: <ClockCircleOutlined /> },
                    { key: '/home/favorites', label: "Favorite", icon: <StarOutlined /> },
                    { key: '/home/bookmarks', label: "Bookmarks", icon: <BookOutlined /> },
                    { key: '/home/settings', label: "Setting", icon: <SettingOutlined /> },
                ]} />
        </>

    )
}