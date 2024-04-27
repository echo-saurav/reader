import { Menu } from "antd"
import { useNavigate } from "react-router-dom"


export default function BottomBarMenu() {
    const navigate=useNavigate()

    return (
        <>
            <Menu
                onClick={(v) => { navigate(v.key) }}
                style={{ borderRight: "none", width: "100%" }}
                mode="horizontal"

                items={[
                    {
                        // icon:<HomeOutlined/>,
                        key: '/home/',
                        label: "Home"
                        // label: <div style={{ textAlign: "center" }}>
                        //     {/* <HomeOutlined /> */}
                        //     <div>Home</div>
                        // </div>
                    },
                    {
                        key: '/home/bookmarks',
                        label: "Bookmarks",
                        // icon:<BookOutlined/>
                        // label: <div style={{ textAlign: "center" }}>
                        //     <BookOutlined />
                        //     <div>Bookmarks</div>
                        // </div>
                    },
                    {
                        key: '/home/favorites',
                        label: "Favorite",
                        // icon:<StarOutlined/>
                        // label: <div style={{ textAlign: "center" }}>
                        //     <StarOutlined />
                        //     <div>Favorites</div>
                        // </div>
                    },
                    {
                        key: '/home/settings',
                        // icon: <SettingOutlined/>,
                        label: "Settings"
                        // label: <div style={{ textAlign: "center" }}>
                        //     <SettingOutlined  />
                        //     <div>Settings</div>
                        // </div>
                    },


                ]} />
        </>
    )
}