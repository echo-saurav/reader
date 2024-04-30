import { createContext, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getBookById } from "../../utils/backend"
import { AppContext } from "../../utils/AppProvider"


export const ReadContext = createContext()
export const ReadProvider = ({ children }) => {
    const [contents, setContents] = useState([])
    const { book_id, page_no = 1 } = useParams()
    const [currentVisiblePage, setCurrentVisiblePage] = useState(page_no)
    const [startPageFrom,setStartPageFrom]=useState(page_no)
    const [progress, setProgress] = useState(0)
    const [book_info, setBookInfo] = useState({})
    const [loading, setLoading] = useState(false)
    const [lastPos, setLastPos] = useState(1)
    const [showBadge,setShowBadge]=useState(false)
    const [jumpOpen, setJumpOpen] = useState(false)
    const { uid } = useContext(AppContext)


    // load data _______________________________________________
    useEffect(() => {
        // load book info
        getBookById(book_id, uid).then((info) => {
            if (info && info.length > 0) {
                setBookInfo(info[0])
                console.log('book info', info[0])
            }
        })
    }, [book_id, uid])


    useEffect(()=>{
        updateProgressPercent(currentVisiblePage)
    },[currentVisiblePage,book_info])

    // scroll listener _______________________________________________
    const waitBeforeUpdatePage = 500

    useEffect(() => {
        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                updatePageView();
            }, waitBeforeUpdatePage);
        };
        let timeout;
        window.addEventListener('scroll', handleScroll);

        // Cleanup function
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeout);
        };
    }, [book_info])


    // update current page to backend 
    const updatePageView = async () => {
        const parentDiv = document.getElementById('pages');
        // if (!parentDiv) return
        const childDivs = parentDiv.children;

        for (const childDiv of childDivs) {
            const isVisible = isElementInViewport(childDiv)

            if (isVisible) {
                // update current page
                setCurrentVisiblePage(parseInt(childDiv.id))
                updateProgressPercent(parseInt(childDiv.id))
                // await setProgressToBackend(book_id, uid, parseInt(childDiv.id))
            }
        }
    }
    // update page url on scroll
    useEffect(() => {
        window.history.replaceState(null, null, `/book/${book_id}/${currentVisiblePage}`);
        updateProgressPercent(currentVisiblePage)

    }, [currentVisiblePage, book_id])

    const updateProgressPercent = (currentPage) => {
        setProgress(getProgressPercent(currentPage))
    }

    const getProgressPercent=(currentPage)=>{
        const totalPage = parseInt(book_info.page_no)
        const percent = (currentPage / totalPage) * 100
        return percent
    }

    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // const scrollTop = document.documentElement.scrollTop;
        // console.log('bottom',scrollTop)

        return (
            rect.top < windowHeight / 2 && rect.bottom > 0
        )
    };

    return (
        <ReadContext.Provider value={{
            currentVisiblePage, setCurrentVisiblePage,
            progress,
            book_info,
            loading,setLoading,
            startPageFrom,setStartPageFrom,
            lastPos, setLastPos,
            contents, setContents,
            showBadge,setShowBadge,
            jumpOpen, setJumpOpen
            
        }}>
            {children}
        </ReadContext.Provider>
    )

}