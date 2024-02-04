import { message } from "antd";
import { createContext, useEffect, useState } from "react";

const LOG_IN = "isLoggedIn";
const ADMIN = "isAdmin";
const THEME = "theme";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [uid, setUid] = useState(
    localStorage.getItem(LOG_IN) ? localStorage.getItem(LOG_IN) : false,
  );
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem(ADMIN) ? localStorage.getItem(ADMIN) : false,
  );
  const [isDarkTheme, setDarkTheme] = useState(
    localStorage.getItem(THEME) === "dark" ? true : false,
  );
  const [isMobile, setMobile] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [ocr, setOcr] = useState(false);
  const [pageImage, setPageImage] = useState(false);
  const [pdfImage, setPdfImage] = useState(true);
  const [pdfText, setPdfText] = useState(true);
  const [imageDarkMode, setImageDarkMode] = useState(true);
  const [clickToLargeImage, setClickToLargeImage] = useState(false);
  // const [messageApi, contextHolder] = message.useMessage();

  const onLogin = (uid, is_admin) => {
    console.log(`uid:${uid}, isadmin:${is_admin}`);
    localStorage.setItem(LOG_IN, uid);
    setUid(uid);

    if (is_admin) {
      localStorage.setItem(ADMIN, uid);
      setIsAdmin(true);
      console.log("from cache", localStorage.getItem(ADMIN))
      console.log("from cache login", localStorage.getItem(LOG_IN))
      console.log("condition", localStorage.getItem(ADMIN) ? localStorage.getItem(ADMIN) : false)

    } else {
      localStorage.setItem(ADMIN, false);
      setIsAdmin(false);
    }
  };

  const onLogout = () => {
    localStorage.removeItem(LOG_IN);
    localStorage.removeItem(ADMIN);
    setUid(false);
  };

  const onToggleTheme = () => {
    let tmpIsDarkTheme = !isDarkTheme;
    localStorage.setItem(THEME, tmpIsDarkTheme ? "dark" : "light");
    setDarkTheme(tmpIsDarkTheme);

    console.log("setting theme to dark", tmpIsDarkTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-prefers-color-scheme",
      isDarkTheme ? "dark" : "light",
    );
  }, [isDarkTheme]);

  const handleWindowSizeChange = () => {
    const mobileMaxWidth = 700;
    if (window.innerWidth < mobileMaxWidth) setMobile(true);
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

  const showToast = (type, text) => {
    // messageApi.open({
    //   type: type,
    //   content: text,
    // });
  };

  return (
    <AppContext.Provider
      value={{
        isDarkTheme,
        onToggleTheme, // theme
        uid,
        onLogin,
        onLogout, // login
        isAdmin,
        setIsAdmin,
        isMobile,
        fontSize,
        setFontSize,
        ocr,
        setOcr,
        pdfImage,
        setPdfImage,
        pageImage,
        setPageImage,
        pdfText,
        setPdfText,
        imageDarkMode,
        setImageDarkMode,
        clickToLargeImage,
        setClickToLargeImage,
        showToast,
      }}
    >
      {/* {contextHolder} */}
      {children}
    </AppContext.Provider>
  );
};
