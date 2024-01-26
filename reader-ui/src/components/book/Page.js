import { Divider, Image, Space } from "antd-mobile";
import { useContext } from "react";
import { AppContext } from "../utils/AppProvider";
import { API } from "../utils/Variables";


export default function Page({ content, onShowImage }) {
    const { fontSize, pdfText, ocr, pdfImage, pageImage, imageDarkMode, clickToLargeImage } = useContext(AppContext)

    return (
        <div key={content.page_no} id={content.page_no} style={{minHeight:"90vh"}}>

            {/* pdf text */}
            {(content.page_content && pdfText) &&
                <div style={{ marginTop: "10px" }}>
                    <h3 style={{ color: "gray" }}>Text from pdf</h3>
                    {content.page_content.split("\n\n").map((text, index) => (
                        
                         <p key={index} style={{ fontSize: `${fontSize}px` }}>
                            {text}
                        </p>
                    ))}
                </div>
            }

            {/* pdf images */}
            {((content.images && content.images.length > 0) && pdfImage) &&
                <div style={{ marginTop: "30px" }}>
                    <h3 style={{ color: "gray" }}>Images from pdf</h3>
                    <Space justify="center" block style={{ overflow: "scroll" }}>
                        {content.images.map((image, index) => (

                            <Image
                                style={{
                                    width: "100%", maxWidth: "400px",
                                    filter: imageDarkMode ? "invert(90%)" : "invert(0%)"
                                }}
                                key={index} onClick={() => {
                                    if (clickToLargeImage) onShowImage(image)
                                }} src={image} />
                        ))}
                    </Space>

                </div>
            }


            {/* page image  */}
            {(content.page_image && pageImage) &&
                <div style={{ marginTop: "30px" }}>
                    <h3 style={{ color: "gray" }} >Pdf page as image</h3>
                    <Image style={{ filter: imageDarkMode ? "invert(90%)" : "invert(0%)" }}
                        src={`${API}/${content.page_image}`}
                        onClick={() => {
                            if (clickToLargeImage) onShowImage(content.page_image)
                        }} />

                </div>
            }


            {/* ocr text */}
            {(content.ocr_text && ocr) &&
                <div style={{ marginTop: "30px" }}>
                    <h3 style={{ color: "gray" }}>Pdf OCR texts</h3>

                    {content.ocr_text.split("\n").map((text, index) => (

                        <p key={index} style={{ fontSize: `${fontSize}px` }}>
                            {text}
                        </p>
                    ))}
                </div>
            }

            <Divider>{content.page_no}</Divider>

        </div>
    )
}
