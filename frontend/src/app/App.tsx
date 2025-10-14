import { Routes, Route } from "react-router-dom";
import { Home, Friends, Profile, Settings } from "../pages";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import { useState } from "react";

export default function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    return (
        <div className="cosmic-gradient min-h-screen w-full">
            <Header
                onSearch={(term) => {
                    setSearchTerm(term);
                    setPage(1);
                }}
            />

            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            searchTerm={searchTerm}
                            page={page}
                            setPage={setPage}
                        />
                    }
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>

            <Footer />
        </div>
    );
}
