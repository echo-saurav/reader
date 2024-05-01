
import Page from "../read/Page"


export default function FullPage({ contents }) {
    return contents.map((content, index) => <Page key={index} content={content} />)

}