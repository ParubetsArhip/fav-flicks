import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPopularMovies, searchMovies } from "../../lib/tmdb";
import { addFavorite, removeFavorite, getFavorites } from "../../lib/favorites";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import MovieSkeleton from "./MovieSkeleton";
import Modal from "../../components/Modal.tsx";
import PopularMoviesSlider from "./features/Swiper/PopularMoviesSlider.tsx";
import { useNavigate } from "react-router-dom";

// 🔹 Дополнительные API-запросы
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const fetchTrending = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch trending");
    return res.json();
};

const fetchPopularTvShows = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch TV shows");
    return res.json();
};

interface HomeProps {
    searchTerm: string;
    page: number;
    setPage: (p: number) => void;
}

const Home = ({ searchTerm, page, setPage }: HomeProps) => {
    const queryClient = useQueryClient();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [filter, setFilter] = useState<"movies" | "tv" | "trending">("movies");

    // 🔹 Определяем, какой запрос выполнять в зависимости от фильтра
    const fetchData = async () => {
        if (searchTerm) return searchMovies(searchTerm, page);
        switch (filter) {
            case "tv":
                return fetchPopularTvShows(page);
            case "trending":
                return fetchTrending(page);
            default:
                return fetchPopularMovies(page);
        }
    };

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["movies", searchTerm, page, filter],
        queryFn: fetchData,
        keepPreviousData: true,
    });

    const movies: Movie[] = data?.results || [];

    const { data: favoriteIds = [] } = useQuery<number[]>({
        queryKey: ["favorites"],
        queryFn: getFavorites,
    });

    const addMutation = useMutation({
        mutationFn: addFavorite,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    });

    const removeMutation = useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    });

    const navigate = useNavigate();

    if (error) return <p className="text-red-400">Error {error.message}</p>;

    const isPrevDisabled = page === 1;
    const isNextDisabled = !data?.results?.length;

    return (
        <div className="flex flex-col">
            {/* 🔹 Слайдер */}
            <div className="flex justify-between items-center">
                <PopularMoviesSlider />
            </div>

            {/* 🔹 Фильтры */}
            <div className="flex justify-center gap-4 mt-10">
                {[
                    { label: "🎬 Movies", value: "movies" },
                    { label: "📺 TV Shows", value: "tv" },
                    { label: "🔥 Trending", value: "trending" },
                ].map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => {
                            setFilter(value as any);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-xl font-medium transition ${
                            filter === value
                                ? "bg-violet-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* 🔹 Сетка фильмов */}
            <div className="flex flex-col items-center pt-[60px] min-h-screen gap-8 px-4 py-2">
                <div className="flex flex-col items-center gap-6 w-full max-w-[1400px]">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <MovieSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                            {movies.map((movie) => {
                                const isFavorite = favoriteIds.includes(movie.id);
                                return (
                                    <div
                                        key={movie.id}
                                        className="bg-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:scale-[1.03] transition-transform"
                                        onClick={() => setSelectedMovie(movie)}
                                    >
                                        {movie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                alt={movie.title || movie.name}
                                                className="w-full h-[500px] object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-[500px] bg-gray-700 flex items-center justify-center text-white text-sm">
                                                No image
                                            </div>
                                        )}
                                        <div className="p-4 flex flex-col gap-2 flex-1">
                                            <h3 className="text-lg font-bold text-white text-center pt-[8px] line-clamp-2">
                                                {movie.title || movie.name}
                                            </h3>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 🔹 Пагинация */}
                <div className="flex items-center gap-4 mt-6">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={isPrevDisabled}
                        className={`px-4 py-2 rounded-xl text-white font-medium transition ${
                            isPrevDisabled
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-violet-600 hover:bg-violet-700"
                        }`}
                    >
                        ◀ Prev
                    </button>

                    <span className="text-white font-semibold">Page {page}</span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={isNextDisabled}
                        className={`px-4 py-2 rounded-xl text-white font-medium transition ${
                            isNextDisabled
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-violet-600 hover:bg-violet-700"
                        }`}
                    >
                        Next ▶
                    </button>
                </div>

                {isFetching && <p className="text-gray-400 text-sm mt-2">Loading more...</p>}

                {/* 🔹 Модалка */}
                <Modal
                    isOpen={!!selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    title={selectedMovie?.title || selectedMovie?.name}
                >
                    {selectedMovie && (
                        <div className="flex flex-col gap-3 text-gray-200">
                            {selectedMovie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                                    alt={selectedMovie.title}
                                    className="rounded-xl mx-auto mb-4"
                                />
                            )}
                            <p className="text-sm">{selectedMovie.overview}</p>
                            <p className="text-yellow-400 mt-2">
                                ⭐ {selectedMovie.vote_average?.toFixed(1)} | 📅{" "}
                                {selectedMovie.release_date || selectedMovie.first_air_date}
                            </p>
                            <button
                                onClick={() =>
                                    favoriteIds.includes(selectedMovie.id)
                                        ? removeMutation.mutate(selectedMovie.id)
                                        : addMutation.mutate(selectedMovie.id)
                                }
                                className={`mt-4 px-4 py-2 rounded-xl text-white font-medium transition cursor-pointer ${
                                    favoriteIds.includes(selectedMovie.id)
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {favoriteIds.includes(selectedMovie.id)
                                    ? "Remove from favorites"
                                    : "Add to favorites"}
                            </button>
                            <button
                                onClick={() => navigate(`/movie/${selectedMovie.id}`)}
                                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white cursor-pointer font-medium transition"
                            >
                                More details →
                            </button>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default Home;
