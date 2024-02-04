import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./components/Home/Home";
import Book from "./components/book/Book";
import Settings from "./components/Settings";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound";
import { AppContext, AppProvider } from "./components/utils/AppProvider";
import { useContext } from "react";

import { theme, ConfigProvider, Layout, Typography, App } from "antd";
import HomeNew from "./components/Home/Homenew";
import BookView from "./components/BookView/BookView";
export const { Title, Paragraph, Text } = Typography;

function AppWrapper() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

function MainApp() {
  const { uid, isDarkTheme } = useContext(AppContext);
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        // token:{lineHeight:0}
      }}
    >
      <div className="App">
        <App>
          <Layout style={{ minHeight: "100svh" }}>
            {uid ? (
              <Router>
                <Routes>
                  <Route path="/" element={<HomeNew />} />
                  {/* <Route path="/" element={<Home />} /> */}
                  <Route path="/book/:book_id" element={<BookView />} />
                  <Route path="/book/:book_id/:page_no" element={<BookView />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            ) : (
              <Router>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Login />} />
                </Routes>
              </Router>
            )}
          </Layout>
        </App>
      </div>
    </ConfigProvider>
  );
}

export default AppWrapper;
