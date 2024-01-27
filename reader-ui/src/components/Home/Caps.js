import { CapsuleTabs } from "antd-mobile"

export default function Caps() {
    const tabs = [
        { "title": "All Books" },
        { "title": "Read Books" },
        { "title": "Unread Books" },
        { "title": "Processing" },
        { "title": "Bookmarks" },
        { "title": "Users" }
    ]
    return (
        <CapsuleTabs>
            {tabs.map((item, index) => (
                <CapsuleTabs.Tab
                    title={item.title}
                    style={{maxWidth:"150px"}}
                    key={index} />
            ))}
        </CapsuleTabs>
    )
}