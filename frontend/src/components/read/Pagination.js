import { useContext, useState } from "react";
import { useEffect } from "react";
import { ReadContext } from "./ReadContext";
import LoadedPages from "./LoadedPages";
import { getBookPages } from "../../utils/backend";
import { useParams } from "react-router-dom";
import { AppContext } from "../../utils/AppProvider";
import { Col, Progress, Row } from "antd";
import PageProgressBar from "./PageProgressBar";


export default function Pagination() {
    const { setLoading, startPageFrom, setLastPos, contents, setContents } = useContext(ReadContext)
    const { uid } = useContext(AppContext)
    const { book_id } = useParams()



    useEffect(() => {
        // load page 
        setLoading(true)
        getBookPages(book_id, uid, startPageFrom).then((newContents) => {
            if (contents.length === 0) {
                setContents(newContents)
                setLoading(false)
            }

            const lastPage = parseInt(contents[contents.length - 1].page_no)


            if (lastPage < startPageFrom) {
                setLastPos(-1)
                setContents([...contents, ...newContents])
            } else {
                const lastKey = contents[0].page_no
                setContents([...newContents, ...contents])
                setLastPos(lastKey)
            }

            setLoading(false)
            // setCurrentVisiblePage(startPageFrom)

        }).catch(e => { setLoading(false) })

    }, [startPageFrom, book_id, uid])






    return (
        <>
            <LoadedPages contents={contents} />
            <PageProgressBar />
        </>
    )
}