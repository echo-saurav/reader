import "./App.css";
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import Home from "./components/Home/Home"
import Book from "./components/book/Book";
import Settings from "./components/Settings";
import Login from "./components/Login/Login"
import NotFound from "./components/NotFound"
import { AppContext, AppProvider } from "./components/utils/AppProvider"
import { useContext } from "react";


function AppWrapper() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  )
}

function App() {
  const { uid } = useContext(AppContext)

  if (uid) {

    return (
      <div className="App">
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:book_id" element={<Book />} />
            <Route path="/book/:book_id/:page_no" element={<Book />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    );
  } else {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </div>
    )
  }

}

export default AppWrapper;
