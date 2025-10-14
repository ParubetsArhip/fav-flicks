import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, removeFavorite } from "../../lib/favorites";
import { fetchMovieById } from "../../lib/tmdb";
import type { Movie } from "../../types/movie";
import MovieSkeleton from "../Home/MovieSkeleton";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Modal from "../../components/Modal.tsx";

const Profile = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [followersCount, setFollowersCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);

    const [isFollowersOpen, setIsFollowersOpen] = useState(false);
    const [isFollowingOpen, setIsFollowingOpen] = useState(false);

    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);

    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data.user;
            if (user) {
                setUserName(user.user_metadata?.name || "Anonymous");
                setUserId(user.id);
                await fetchFollowData(user.id);
            }
        };
        getUser();
    }, []);

    const fetchFollowData = async (id: string) => {
        const { data: followersData } = await supabase
            .from("follows")
            .select("follower_id")
            .eq("following_id", id);

        const { data: followingData } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", id);

        const followerProfiles = followersData?.length
            ? (
                await supabase
                    .from("profiles")
                    .select("id, username, avatar_url")
                    .in(
                        "id",
                        followersData.map((f) => f.follower_id)
                    )
            ).data
            : [];

        const followingProfiles = followingData?.length
            ? (
                await supabase
                    .from("profiles")
                    .select("id, username, avatar_url")
                    .in(
                        "id",
                        followingData.map((f) => f.following_id)
                    )
            ).data
            : [];

        setFollowersCount(followerProfiles?.length || 0);
        setFollowingCount(followingProfiles?.length || 0);
        setFollowers(followerProfiles || []);
        setFollowing(followingProfiles || []);
    };

    const handleUnfollow = async (targetId: string) => {
        if (!userId) return;
        await supabase
            .from("follows")
            .delete()
            .eq("follower_id", userId)
            .eq("following_id", targetId);
        await fetchFollowData(userId);
    };

    const handleRemoveFollower = async (targetId: string) => {
        if (!userId) return;
        await supabase
            .from("follows")
            .delete()
            .eq("follower_id", targetId)
            .eq("following_id", userId);
        await fetchFollowData(userId);
    };

    // --- Favorites
    const { data: favoriteIds = [], isLoading: loadingFav } = useQuery<number[]>({
        queryKey: ["favorites"],
        queryFn: getFavorites,
    });

    const { data: favoriteMovies = [], isLoading: loadingMovies } = useQuery<Movie[]>({
        queryKey: ["favoriteMovies", favoriteIds],
        queryFn: async () => {
            const movies = await Promise.all(favoriteIds.map((id) => fetchMovieById(id)));
            return movies;
        },
        enabled: favoriteIds.length > 0,
    });

    // --- Mutation для удаления из избранного
    const removeMutation = useMutation({
        mutationFn: removeFavorite,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
    });

    if (loadingFav || loadingMovies) {
        return (
            <div className="pt-[100px] flex flex-col items-center gap-6">
                <p className="text-gray-300 text-lg">Loading favorite movies...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[800px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <MovieSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center pt-[100px] min-h-screen gap-8 px-2 py-2">
            <div className="flex flex-col items-center gap-6 w-full max-w-[800px]">
                <img
                    src="https://i.pravatar.cc/150"
                    alt="avatar"
                    className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover"
                />

                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">{userName}</h2>

                    <div className="flex gap-8 text-gray-300 justify-center sm:justify-start">
                        <p
                            onClick={() => setIsFollowersOpen(true)}
                            className="cursor-pointer hover:text-white transition"
                        >
                            <span className="font-bold text-white">{followersCount}</span> followers
                        </p>
                        <p
                            onClick={() => setIsFollowingOpen(true)}
                            className="cursor-pointer hover:text-white transition"
                        >
                            <span className="font-bold text-white">{followingCount}</span> following
                        </p>
                    </div>

                    <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                        Edit Profile
                    </button>
                </div>

                {/* Followers Modal */}
                <Modal isOpen={isFollowersOpen} onClose={() => setIsFollowersOpen(false)} title="Followers">
                    {followers.length === 0 ? (
                        <p className="text-center text-gray-300">No followers yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {followers.map((f) => (
                                <li
                                    key={f.id}
                                    className="flex items-center justify-between bg-white/10 rounded-lg p-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={f.avatar_url || "/default-avatar.png"}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span className="text-white">{f.username}</span>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFollower(f.id)}
                                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Modal>

                {/* Following Modal */}
                <Modal isOpen={isFollowingOpen} onClose={() => setIsFollowingOpen(false)} title="Following">
                    {following.length === 0 ? (
                        <p className="text-center text-gray-300">You don’t follow anyone yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {following.map((f) => (
                                <li
                                    key={f.id}
                                    className="flex items-center justify-between bg-white/10 rounded-lg p-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={f.avatar_url || "/default-avatar.png"}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <span className="text-white">{f.username}</span>
                                    </div>
                                    <button
                                        onClick={() => handleUnfollow(f.id)}
                                        className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                                    >
                                        Unfollow
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </Modal>
            </div>

            <h1 className="text-3xl font-bold text-white">My favorite films</h1>

            {favoriteIds.length === 0 ? (
                <p className="text-gray-400 text-lg">You don't have any favorite movies yet 💔</p>
            ) : (
                <div className="flex flex-col items-center gap-6 w-full max-w-[800px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {favoriteMovies.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => setSelectedMovie(movie)} // 💥 клик по карточке открывает модалку
                                className="bg-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] transition-transform"
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
                                    <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 🪄 Модальное окно для фильма */}
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
                            ⭐ {selectedMovie.vote_average?.toFixed(1)} | 📅 {selectedMovie.release_date}
                        </p>

                        <button
                            onClick={() => {
                                if (selectedMovie) {
                                    removeMutation.mutate(selectedMovie.id);
                                    setSelectedMovie(null);
                                }
                            }}
                            className="mt-4 px-4 py-2 rounded-xl text-white font-medium bg-red-600 hover:bg-red-700 transition"
                        >
                            Remove from favorites
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Profile;
