import { useContext, } from "react";
import { AppContext } from "../utils/AppProvider";
import { API } from "../utils/Variables";
import { Divider, Image, } from "antd";
import { Paragraph, Text, } from "../../App";


export default function Page({ content }) {
    const { fontSize, pdfText, ocr, pdfImage, pageImage, imageDarkMode, clickToLargeImage } = useContext(AppContext)

    return (
        <div key={content.page_no} id={content.page_no} style={{ minHeight: "90vh" }}>

            {/* pdf images */}
            {((content.images && content.images.length > 0) && pdfImage) &&
                <div style={{ marginTop: "10px" }}>
                    <Text type="secondary" strong>
                        Images from pdf
                    </Text>
                    <div style={{ marginTop: "10px" }}>
                        <Image.PreviewGroup>
                            {content.images.map((xref, index) => (
                                <Image
                                    preview={clickToLargeImage}
                                    fallback={<Paragraph>Loading failed </Paragraph>}
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
                    <Text
                        type="secondary" strong>
                        Text from pdf
                    </Text>
                    <div style={{ marginTop: "20px" }}>
                        {content.page_content.split("\n").map((text, index) => (
                            <Paragraph
                                key={index}
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: "18px"
                                }}>
                                {text}
                            </Paragraph>
                        ))}
                    </div>
                </div>
            }


            {/* page image  */}
            {(content.page_image && pageImage) &&
                <div style={{ marginTop: "10px" }}>
                    <Text type="secondary" strong>
                        Pdf page as image
                    </Text>
                    <Image
                        style={{ filter: imageDarkMode ? "invert(90%)" : "invert(0%)" }}
                        src={`${API}/${content.page_image}`}
                        preview={clickToLargeImage}
                    />
                </div>
            }


            {/* ocr text */}
            {(content.ocr_text && ocr) &&
                <div style={{ marginTop: "30px" }}>

                    <Text type="secondary" strong>Pdf OCR texts</Text>

                    {content.ocr_text.split("\n").map((text, index) => (
                        <Paragraph
                            key={index}
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: "18px"
                            }}>
                            {text}
                        </Paragraph>
                    ))}
                </div>
            }

            <Divider>{content.page_no}</Divider>

        </div>
    )
}


