import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Autoplay } from "swiper/modules";
import { fetchPopularMovies } from "../../../../lib/tmdb";
import "swiper/css";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
}

const PopularMoviesSlider: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const randomPage = Math.floor(Math.random() * 10) + 1;
                const data = await fetchPopularMovies(randomPage);
                setMovies(data.results || []);
            } catch (error) {
                console.error("Ошибка загрузки популярных фильмов:", error);
            }
        };

        loadMovies();
    }, []);

    return (
        <section className="w-full flex flex-col items-center justify-center py-10 text-white mt-[50px]">
            {/* Заголовок сверху */}
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                🎬 Popular Movies
            </h2>

            {/* Горизонтальный Swiper */}
            <Swiper
                modules={[Mousewheel, Autoplay]}
                slidesPerView={4}
                spaceBetween={20}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                mousewheel
                loop
                className="w-full max-w-7xl h-[400px] rounded-2xl overflow-hidden"
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                }}
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <div className="relative group cursor-pointer">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-[400px] object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                                <p className="text-sm text-gray-300">
                                    ⭐ {movie.vote_average.toFixed(1)} • {movie.release_date?.slice(0, 4)}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default PopularMoviesSlider;

