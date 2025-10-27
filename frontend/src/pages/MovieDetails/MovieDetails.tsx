
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieById, fetchMovieCredits, fetchMovieVideos } from "../../lib/tmdb.ts";
import type { Movie } from "../../types/movie.ts";

export default function MovieDetails() {
    const { id } = useParams<{ id: string }>();

    const { data: movie, isLoading, error } = useQuery<Movie>({
        queryKey: ["movie", id],
        queryFn: () => fetchMovieById(Number(id)),
    });

    const { data: credits } = useQuery({
        queryKey: ["credits", id],
        queryFn: () => fetchMovieCredits(Number(id)),
        enabled: !!id,
    });

    const { data: videos } = useQuery({
        queryKey: ["videos", id],
        queryFn: () => fetchMovieVideos(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return <p className="text-center text-gray-400 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Failed to load movie.</p>;
    if (!movie) return null;

    const trailer = videos?.results?.find((v: any) => v.type === "Trailer");

    return (
        <div className="max-w-6xl mx-auto p-6 text-white space-y-10 mt-[70px]">
            {/* 🔹 Основная информация */}
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full md:w-[350px] rounded-2xl shadow-xl object-cover"
                />
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">{movie.title}</h1>
                    <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                        <p>📅 {movie.release_date}</p>
                        <p>⭐ {movie.vote_average?.toFixed(1)}</p>
                        <p>💰 ${movie.budget?.toLocaleString()}</p>
                        <p>⏱ {movie.runtime} min</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {movie.genres?.map((g) => (
                            <span key={g.id} className="bg-white/10 px-3 py-1 rounded-lg text-sm">
                                {g.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔹 Трейлер */}
            {trailer && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">🎬 Trailer</h2>
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Trailer"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                </div>
            )}

            {/* 🔹 Актёры */}
            {credits && credits.cast.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">👥 Cast</h2>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent custom-scroll">
                        {credits.cast.slice(0, 10).map((actor: any) => (
                            <div
                                key={actor.id}
                                className="min-w-[120px] bg-white/10 p-3 rounded-xl flex flex-col items-center text-center shadow-md hover:scale-105 transition-transform"
                            >
                                {actor.profile_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                        alt={actor.name}
                                        className="w-[100px] h-[140px] object-cover rounded-lg mb-2"
                                    />
                                ) : (
                                    <div className="w-[100px] h-[140px] bg-gray-700 rounded-lg mb-2 flex items-center justify-center text-xs text-gray-300">
                                        No Image
                                    </div>
                                )}
                                <p className="text-sm font-semibold">{actor.name}</p>
                                <p className="text-xs text-gray-400">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
