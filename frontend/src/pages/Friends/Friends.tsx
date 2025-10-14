import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";

const Friends = () => {
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [following, setFollowing] = useState<string[]>([]);
    const [results, setResults] = useState<{ id: string; username: string | null; avatar_url: string | null }[]>([]);
    const [query, setQuery] = useState("");

    const fetchFollowing = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", user.id);
        if (error) console.error(error);
        setFollowing(data?.map((f) => f.following_id) || []);
    }, [user]);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            (async () => {
                await fetchFollowing();
            })();
        }
    }, [user, fetchFollowing]);

    const searchUsers = async () => {
        if (!query.trim()) return;
        const { data, error } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .ilike("username", `%${query}%`);
        if (error) console.error(error);
        setResults(data || []);
    };

    const followUser = async (targetId: string) => {
        if (!user) return;
        const { error } = await supabase.from("follows").insert({
            follower_id: user.id,
            following_id: targetId,
        });
        if (error) console.error(error);
        else await fetchFollowing();
    };

    return (
        <div className='pt-30 min-h-screen'>
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-md
                        rounded-3xl shadow-xl
            ">
                <h2 className="text-2xl font-bold text-white mb-4">Search Friends</h2>

                <div className="flex gap-2 w-full">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by username"
                        className="flex-1 px-4 py-2 rounded-full bg-gray-700/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    />
                    <button
                        onClick={searchUsers}
                        className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors duration-300"
                    >
                        Search
                    </button>
                </div>

                <div className="flex flex-col gap-3 w-full mt-4">
                    {results.map((r) => (
                        <div
                            key={r.id}
                            className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <img
                                src={r.avatar_url || "/default-avatar.png"}
                                alt="avatar"
                                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                            />
                            <span className="text-white font-medium flex-1">{r.username}</span>

                            {following.includes(r.id) ? (
                                <span className="text-green-400 font-semibold">✅ Following</span>
                            ) : (
                                <button
                                    onClick={() => followUser(r.id)}
                                    className="px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-300"
                                >
                                    Follow
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Friends;
