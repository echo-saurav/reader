import { Route, Routes } from "react-router-dom";
import BookList from "../Booklist";
import Settings from "../Settings";
import Bookmarks from "../bookmarks/Bookmarks";
import Favorites from "../Favorites";
import NotFound from "../NotFound";
import BookInfo from "../BookInfo";
import CurrentlyReading from "../CurrentlyReading";

export default function HomeRoutes() {
    return (
        <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="bookmarks" element={<Bookmarks />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="currentlyReading" element={<CurrentlyReading />} />
            <Route path="bookInfo/:book_id" element={<BookInfo />} />

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}