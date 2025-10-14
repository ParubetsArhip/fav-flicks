import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchPopularMovies, searchMovies } from "../../lib/tmdb";
import { addFavorite, removeFavorite, getFavorites } from "../../lib/favorites";
import type { Movie } from "../../types/movie";
import { useState } from "react";
import MovieSkeleton from "./MovieSkeleton";
import Modal from "../../components/Modal.tsx";

interface HomeProps {
    searchTerm: string;
    page: number;
    setPage: (p: number) => void;
}

const Home = ({ searchTerm, page, setPage }: HomeProps) => {

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, error, isFetching } = useQuery({
        queryKey: ["movies", searchTerm, page],
        queryFn: () =>
            searchTerm
                ? searchMovies(searchTerm, page)
                : fetchPopularMovies(page),
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

    if (error) return <p className="text-red-400">Error {error.message}</p>;

    const isPrevDisabled = page === 1;
    const isNextDisabled = !data?.results?.length;

    return (
        <div className="flex flex-col items-center pt-[100px] min-h-screen gap-8 px-2 py-2">
            <div className="flex flex-col items-center gap-6 w-full max-w-[800px]">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <MovieSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {movies.map((movie) => {
                            const isFavorite = favoriteIds.includes(movie.id);
                            return (
                                <div
                                    key={movie.id}
                                    className="bg-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col
                                        cursor-pointer hover:scale-[1.02] transition-transform"
                                    onClick={() => setSelectedMovie(movie)}
                                >
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-[400px] object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-[400px] bg-gray-700 flex items-center justify-center text-white text-sm">
                                            No image
                                        </div>
                                    )}
                                    <div className="p-4 flex flex-col gap-2 flex-1">
                                        <h3 className="text-xl font-bold text-white text-center pt-[8px]">
                                            {movie.title}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={isPrevDisabled}
                    className={`px-4 py-2 rounded-xl text-white font-medium transition
                        ${isPrevDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
                >
                    ◀ Prev
                </button>

                <span className="text-white font-semibold">Page {page}</span>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isNextDisabled}
                    className={`px-4 py-2 rounded-xl text-white font-medium transition
                        ${isNextDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
                >
                    Next ▶
                </button>
            </div>

            {isFetching && (
                <p className="text-gray-400 text-sm mt-2">Loading more movies...</p>
            )}

            <Modal
                isOpen={!!selectedMovie}
                onClose={() => setSelectedMovie(null)}
                title={selectedMovie?.title}
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
                            {selectedMovie.release_date}
                        </p>
                        <button
                            onClick={() =>
                                favoriteIds.includes(selectedMovie.id)
                                    ? removeMutation.mutate(selectedMovie.id)
                                    : addMutation.mutate(selectedMovie.id)
                            }
                            className={`mt-4 px-4 py-2 rounded-xl text-white font-medium transition
                                cursor-pointer ${
                                favoriteIds.includes(selectedMovie.id)
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                            {favoriteIds.includes(selectedMovie.id)
                                ? "Remove from favorites"
                                : "Add to favorites"}
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Home;
