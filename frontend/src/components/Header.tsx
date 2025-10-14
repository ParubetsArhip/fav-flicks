import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

interface MenuItemProps {
    id: number;
    name: string;
    link: string;
}

interface HeaderProps {
    onSearch: (term: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
    const menuItems: MenuItemProps[] = [
        { id: 1, name: "Home", link: "/" },
        { id: 2, name: "Friends", link: "/friends" },
        { id: 3, name: "Settings", link: "/settings" },
        { id: 4, name: "Profile", link: "/profile" },
    ];

    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
        setIsSearchOpen(false);
    };

    return (
        <header
            className={`relative fixed top-[30px] left-1/2 -translate-x-1/2 z-50
        flex items-center justify-between rounded-full shadow-lg
        bg-gradient-to-bl from-violet-500/40 to-fuchsia-500/30
        backdrop-blur-lg w-full max-w-[700px] px-4 h-[60px]`}
        >
            {/* 🔍 Поиск */}
            <div className="relative flex items-center gap-2">
                <button
                    onClick={() => setIsSearchOpen((prev) => !prev)}
                    className="text-white hover:scale-110 transition-transform cursor-pointer"
                >
                    <Search size={22} />
                </button>

                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out
            ${isSearchOpen ? "max-w-[250px] opacity-100 ml-2" : "max-w-0 opacity-0"}`}
                >
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Find your movie..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus={isSearchOpen}
                            className="w-[250px] h-[36px] rounded-full bg-white/10
                text-white placeholder-gray-300 px-3 outline-none
                focus:ring-2 focus:ring-fuchsia-400 transition-all duration-300"
                        />
                    </form>
                </div>
            </div>

            {/* 🔸 Десктоп меню */}
            <nav className="hidden md:flex flex-1 justify-around text-white font-semibold text-lg drop-shadow-md">
                <ul className="flex items-center justify-around flex-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <li key={item.id} className="hover:scale-110 transition-transform duration-300 ease-in-out">
                                <Link
                                    to={item.link}
                                    className={`uppercase cursor-pointer ${isActive ? "text-purple-300" : "text-white"}`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* 🔹 Бургер для мобилок */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="text-white hover:scale-110 transition-transform"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* 🔹 Мобильное меню */}
            {isMenuOpen && (
                <div className="absolute top-[70px] left-0 w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-4 flex flex-col gap-3 md:hidden">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.link;
                        return (
                            <Link
                                key={item.id}
                                to={item.link}
                                className={`uppercase text-white p-2 rounded-lg transition-colors ${
                                    isActive ? "bg-purple-500/30" : "hover:bg-white/20"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </header>
    );
}
