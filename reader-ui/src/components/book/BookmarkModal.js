
import { useContext, useEffect, useRef, useState } from "react";
import { saveBookmarkToBackend } from "../utils/backend";
import { AppContext } from "../utils/AppProvider";
import { API } from "../utils/Variables";




export default function BookmarkModal({ visible = false, setVisible, book_id, page_no }) {
    const [text, setText] = useState("")
    const { uid } = useContext(AppContext)
    // const inputRef = useRef(null)

    // useEffect(()=>{
    //     inputRef.current.autoFocus=true
    // },[])

    const onSaveBookmark = () => {
        saveBookmarkToBackend(text, uid, book_id, page_no).then(res => {
            console.log("text",text)
            console.log("bookmark",res)
            if (res) {
                setText("")
                setVisible(false)
            } else {


            }
        }).catch(e => {
            
        })
    }

    const onClose = () => {
        setText("")
        setVisible(false)
    }

    return (
        <></>
        // <Popup showCloseButton
        //     visible={visible}
        //     // position={isMobile ? "bottom" : 'right'}
        //     position="bottom"
        //     // bodyStyle={{height:"40vh"}}
        //     // bodyStyle={{ height: isMobile ? '50dvh' : '100dvh' }}
        //     onClose={() => { onClose() }}
        //     onMaskClick={() => { onClose() }}>

        //     <div style={{ padding: "20px" }} >
        //         <Image
        //             width={100}
        //             src={`${API}/book/image/${book_id}/${page_no}/t`} />
        //         <h3>Bookmark page {page_no}</h3>
        //         <TextArea
        //             value={text}
        //             onChange={(t)=>{setText(t)}}
        //             autoSize={{ minRows: 5, maxRows: 15 }}
        //             placeholder="Enter your bookmark text" />
        //         <Button size="small"
        //             onClick={() => { onSaveBookmark() }}
        //             color="primary">
        //             Save bookmark
        //         </Button>
        //     </div>
        // </Popup>
    )

}