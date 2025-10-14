const Footer = () => {
    return (
        <footer className="
              relative
              bottom-0
              left-0
              right-0
              w-full
              py-6
              mt-12
              shadow-lg
              bg-gradient-to-bl from-violet-500/30 to-fuchsia-500/25
              backdrop-blur-md
              opacity-70
            ">
            <div className="max-w-[500px] min-w-[300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-lg font-bold text-white drop-shadow-md mb-1">Fav Flicks</h3>
                    <p className="text-gray-200 text-sm text-center md:text-left">Explore the universe of movies and connect with friends!</p>
                </div>

                <div className="flex gap-4 mt-3 md:mt-0">
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full text-white border border-white/30 hover:border-white transition-colors duration-300 text-sm font-medium"
                    >
                        About
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full text-white border border-white/30 hover:border-white transition-colors duration-300 text-sm font-medium"
                    >
                        Contact
                    </a>
                    <a
                        href="#"
                        className="px-4 py-2 rounded-full text-white border border-white/30 hover:border-white transition-colors duration-300 text-sm font-medium"
                    >
                        Privacy
                    </a>
                </div>
            </div>

            <div className="mt-4 text-center text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} Cosmic Movies. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
