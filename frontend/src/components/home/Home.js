import { Card, Input, Layout } from "antd";
import { useContext, } from "react";
import { AppContext } from "../../utils/AppProvider";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { SearchOutlined, } from "@ant-design/icons";
import BottomBarMenu from "./bottombarMenu";
import SidebarMenu from "./sidebarMenu";
import HomeRoutes from "./HomeRoutes";



export default function Home() {
    
    const searchBar = <Input
        style={{ margin: '10px' }}
        onChange={(e) => {
            // onQueryBooks(e.target.value);
        }}
        // value={query}
        placeholder="Search books, bookmarks or text"
        prefix={<SearchOutlined />}
    />

    return <HomeLayout
        contentEl={<HomeRoutes />}
        headerEl={searchBar}
        sidebarMenuEl={<SidebarMenu />}
        bottomBarEl={<BottomBarMenu />} />
}


function HomeLayout({ sidebarMenuEl, headerEl, bottomBarEl, contentEl }) {
    const { isMobile } = useContext(AppContext)
    const sidebarWidth = "300px"
    const bottombarHeight = "70px"

    return (
        <Layout>
            {!isMobile && <Sider width={sidebarWidth} style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: "transparent"
            }}>
                {sidebarMenuEl}
            </Sider>}
            <Layout>
                <Header style={{
                    marginLeft: isMobile ? 0 : sidebarWidth,
                    position: 'sticky',
                    top: 0,
                    background: "transparent",
                    zIndex: 1,
                    display: 'flex',
                    padding: '0'
                }}>
                    {headerEl}
                </Header>
                <Content
                    style={{
                        marginLeft: isMobile ? 0 : sidebarWidth,
                        marginBottom: bottombarHeight
                    }} >
                    {contentEl}
                </Content>
            </Layout>
            {isMobile && <Card
                bordered={false}
                size="small"
                style={{
                    width: "100vw",
                    height: bottombarHeight,
                    bottom: 0,
                    position: 'fixed',
                    padding: "0",
                    margin: "0"
                }}>

                {bottomBarEl}
            </Card>}
        </Layout>
    )
}