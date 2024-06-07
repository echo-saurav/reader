import Layout from 'antd/es/layout/layout';
import './App.css';
import Home from './components/home/Home';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { App, ConfigProvider, theme } from 'antd';
import { AppContext, AppProvider } from './utils/AppProvider';
import { useContext, } from 'react';

import Login from './components/Login';
import NotFound from './components/NotFound';
import Read from './components/read/Read';
import Settings from './components/Settings';

function AppRouter() {
  const { uid, isDarkTheme } = useContext(AppContext);



  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Slider: {
            handleSize: 20,
            railSize: 20
          },
        },
      }}>

      <App notification={{
        placement: 'bottomLeft',
      }}>
        <Layout style={{ minHeight: "100svh" }}>
          {uid ? (
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home/*" element={<Home />} />
                <Route path="/book/:book_id" element={<Read />} />
                <Route path="/book/:book_id/:page_no" element={<Read />} />
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

    </ConfigProvider>
  );
}

export default function ContextWrapper() {

  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}


