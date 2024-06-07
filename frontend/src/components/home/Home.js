import { Card, FloatButton, Input, Layout } from "antd";
import { useContext, useState, } from "react";
import { AppContext } from "../../utils/AppProvider";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { BarsOutlined, BookOutlined, ClockCircleOutlined, HomeOutlined, MenuOutlined, SearchOutlined, SettingOutlined, StarOutlined, TeamOutlined, } from "@ant-design/icons";
import BottomBarMenu from "./bottombarMenu";
import SidebarMenu from "./SidebarMenu";
import HomeRoutes from "./HomeRoutes";
import { useNavigate } from "react-router-dom";
import FloatingNavigation from "./FloatingNavigation";



export default function Home() {

    const searchBar =
        <Layout style={{ padding: "5px" }}>

            <Input
                size="large"
                // style={{ margin: '10px' }}
                onChange={(e) => {
                    // onQueryBooks(e.target.value);
                }}
                // value={query}
                placeholder="Search books, bookmarks or text"
                prefix={<SearchOutlined />}
            />
        </Layout>

    return <HomeLayout
        contentEl={<HomeRoutes />}
        headerEl={searchBar}
        sidebarMenuEl={<SidebarMenu />}
        bottomBarEl={<BottomBarMenu />} />
}


function HomeLayout({ sidebarMenuEl, headerEl, bottomBarEl, contentEl }) {
    const { collapsed, setCollapsed, isMobile, isDarkTheme } = useContext(AppContext)
    const sidebarWidth = "250px"
    const sidebarWidthMin = "80px"
    const bottombarHeight = "70px"

    const getSidebarWidth = () => {
        if (collapsed) return sidebarWidthMin
        else return sidebarWidth
    }

    return (
        <Layout>
            {!isMobile &&
                <Sider
                    theme={isDarkTheme ? "dark" : "light"}
                    collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
                    width={sidebarWidth} style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        // background: "transparent"
                    }}>
                    {sidebarMenuEl}
                </Sider>}
            <Layout>
                <Header style={{
                    marginLeft: isMobile ? 0 : getSidebarWidth(),
                    position: 'sticky',
                    top: 0,
                    background: "transparent",
                    zIndex: 100,
                    display: 'flex',
                    padding: '0'
                }}>

                    {headerEl}
                </Header>
                <Content
                    style={{
                        marginLeft: isMobile ? 0 : getSidebarWidth(),
                        marginBottom: bottombarHeight,
                        padding: "10px"
                    }} >
                    {contentEl}
                </Content>
            </Layout>
            <FloatingNavigation/>


        </Layout>
    )
}