import { CapsuleTabs } from "antd-mobile"

export default function HomeCaps({ tabs, activeKey, onChange }) {

    return (
        <CapsuleTabs
            activeKey={activeKey}
            onChange={(e) => {
                onChange(e)
            }}
        >
            {tabs.map((item, index) => (
                <CapsuleTabs.Tab
                    title={item.title}
                    style={{ maxWidth: "150px" }}
                    key={index} />
            ))}
        </CapsuleTabs>
    )
}