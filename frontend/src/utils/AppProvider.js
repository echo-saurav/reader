import { useAtom } from "jotai";
import { createContext, useEffect, useState } from "react"
import { atomWithStorage } from 'jotai/utils';

export const AppContext = createContext()
const mobileLayoutWidth = 700
const isDarkTheme_ = atomWithStorage('theme', false)
const isAdmin_ = atomWithStorage('admin', false)
const uid_ = atomWithStorage('uid', null)
const fontSize_ = atomWithStorage('fontSize', 16)
const ocr_ = atomWithStorage('ocr', false)
const pageImage_ = atomWithStorage('pageImage', false)
const pdfImage_ = atomWithStorage('pdfImage', false)
const pdfText_ = atomWithStorage('pdfText', true)
const imageDarkMode_ = atomWithStorage("imageDarkMode", true)
const imageClick_ = atomWithStorage('imageClick', false)

export const AppProvider = ({ children }) => {
    const [isMobile, setMobile] = useState(true);
    const [isDarkTheme, setDarkTheme] = useAtom(isDarkTheme_)
    const [isAdmin, setAdmin] = useAtom(isAdmin_)
    const [uid, setUid] = useAtom(uid_)
    const [fontSize, setFontSize] = useAtom(fontSize_)
    const [ocr, setOcr] = useAtom(ocr_)
    const [pageImage, setPageImage] = useAtom(pageImage_)
    const [pdfImage, setPdfImage] = useAtom(pdfImage_)
    const [pdfText, setPdfText] = useAtom(pdfText_)
    const [imageDarkMode, setImgaeDarkMode] = useAtom(imageDarkMode_)
    const [imageClick, setImageClick] = useAtom(imageClick_)

    const onToggleTheme = () => {
        setDarkTheme(!isDarkTheme)
    };

    const onLogin = (username, password) => {
        setAdmin(true)
        setUid("123")
    };

    const onLogout = () => {
        setAdmin(false)
        setUid(null)
    };


    // mobile detection
    const handleWindowSizeChange = () => {
        if (window.innerWidth < mobileLayoutWidth) setMobile(true);
        else setMobile(false);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowSizeChange);
        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };
    }, []);

    useEffect(() => {
        handleWindowSizeChange();
    }, []);


    return (
        <AppContext.Provider value={{
            isDarkTheme, onToggleTheme, // theme
            uid, isAdmin, onLogin, onLogout,// user management
            isMobile,
            fontSize,setFontSize,
            ocr,setOcr,
            pageImage,setPageImage,
            pdfImage,setPdfImage,
            pdfText,setPdfText,
            imageDarkMode,setImgaeDarkMode,
            imageClick,setImageClick
        }}>
            {children}
        </AppContext.Provider>
    )
}