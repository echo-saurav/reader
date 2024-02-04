import { Radio, Space } from "antd"

export default function HomeCaps({ tabs, activeKey, onChange }) {

    return (
        <Space style={{ marginTop: "10px" }}>
            <Radio.Group
                buttonStyle="solid"
                value={activeKey}
                onChange={(v) => {
                    onChange(v.target.value)
                }}>
                {tabs.map((item, index) => (
                    <Radio.Button
                        key={item.key}
                        value={item.key}>
                        {item.title}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </Space>


    )
}