
import Page from "./Page"



export default function FullPage({ contents }) {
    return contents.map((content, index) => <Page key={index} content={content} />)

}