import { useContext, } from "react";


import { Divider, Image, Typography, } from "antd";
import { AppContext } from "../../utils/AppProvider";



export default function Page({ content }) {
    const { fontSize, pdfText, ocr, pdfImage, pageImage, imageDarkMode, clickToLargeImage } = useContext(AppContext)

    return (
        <div key={content.page_no} id={content.page_no}>


            <div  style={{ minHeight: "90vh", padding: "16px" }}>

                {/* pdf images */}
                {((content.images && content.images.length > 0) && pdfImage) &&
                    <div style={{ marginTop: "10px" }}>
                        <Typography.Text type="secondary" strong>
                            Images from pdf
                        </Typography.Text>
                        <div style={{ marginTop: "10px" }}>
                            <Image.PreviewGroup>
                                {content.images.map((xref, index) => (
                                    <Image
                                        preview={clickToLargeImage}
                                        fallback={<Typography.Paragraph>Loading failed </Typography.Paragraph>}
                                        style={{
                                            width: "100%", maxWidth: "400px",
                                            filter: imageDarkMode ? "invert(90%)" : "invert(0%)"
                                        }}
                                        key={index}
                                        src={xref}
                                    />
                                ))}
                            </Image.PreviewGroup>
                        </div>
                    </div>
                }
                {/* pdf text */}
                {(content.page_content && pdfText) &&
                    <div style={{ marginTop: "10px" }}>
                        <Typography.Text
                            type="secondary" strong>
                            Text from pdf
                        </Typography.Text>
                        <div style={{ marginTop: "20px" }}>
                            {content.page_content.split("\n").map((text, index) => (
                                <Typography.Paragraph
                                    key={index}
                                    style={{
                                        fontSize: `${fontSize}px`,
                                        // lineHeight: "18px"
                                    }}>
                                    {text}
                                </Typography.Paragraph>
                            ))}
                        </div>
                    </div>
                }


                {/* page image  */}
                {(content.page_image && pageImage) &&
                    <div style={{ marginTop: "10px" }}>
                        <Typography.Text type="secondary" strong>
                            Pdf page as image
                        </Typography.Text>
                        <Image
                            style={{ filter: imageDarkMode ? "invert(90%)" : "invert(0%)" }}
                            // src={`${API}/${content.page_image}`}
                            preview={clickToLargeImage}
                        />
                    </div>
                }


                {/* ocr text */}
                {(content.ocr_text && ocr) &&
                    <div style={{ marginTop: "30px" }}>

                        <Typography.Text type="secondary" strong>Pdf OCR texts</Typography.Text>

                        {content.ocr_text.split("\n").map((text, index) => (
                            <Typography.Paragraph
                                key={index}
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: "18px"
                                }}>
                                {text}
                            </Typography.Paragraph>
                        ))}
                    </div>
                }

              

            </div>
            <Divider>{content.page_no}</Divider>
        </div>
    )
}


