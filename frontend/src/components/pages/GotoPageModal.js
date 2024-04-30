import { Button, Drawer, Input, InputNumber, Modal, Progress, Slider, Typography } from "antd";
import { useContext, useState } from "react";
import { AppContext } from "../../utils/AppProvider";
import { ArrowRightOutlined } from "@ant-design/icons";


export default function GotoPageModal({ currentPageNo = 1, totalPage, open, onClose, onGotoPage }) {
    const [jumpPage, setJumpPage] = useState(currentPageNo)
    const { isMobile } = useContext(AppContext)



    return (
        <Drawer
            height={230}
            title={`jump to ${jumpPage}`}
            placement="bottom"
            // placement={isMobile ? "bottom" : 'right'}
            onClose={onClose}
            open={open}>

            <InputNumber
                min={1}
                max={totalPage}
                style={{ width: "100%", fontSize: "23px", margin: 0 }}
                value={jumpPage}
                onChange={(v) => { setJumpPage(v) }}
            />
            <Slider
                style={{ margin: 0 }}
                value={jumpPage}
                onChange={(v) => { setJumpPage(v) }}
                min={1}
                max={totalPage} />

            <Button
                onClick={() => { onGotoPage(jumpPage) }}
                icon={<ArrowRightOutlined />}
                type="primary">
                Done
            </Button>
        </Drawer>
    )
    // return (
    //     <Modal 
    //     style={{  bottom:0 }}
    //     open={open}>
    //         <div>
    //             <Typography.Title level={3}>Jump to page</Typography.Title>

    //             <InputNumber

    //                 min={1}
    //                 max={totalPage}
    //                 style={{ width:"100%", fontSize:"23px", margin:0 }}
    //                 value={jumpPage}
    //                 onChange={(v) => { setJumpPage(v) }}
    //             />
    //             <Slider
    //                 style={{margin:0}}
    //                 value={jumpPage}
    //                 onChange={(v) => { setJumpPage(v) }}
    //                 min={1}
    //                 max={totalPage} />
    //         </div>
    //     </Modal>
    // )

}