import { supabase } from "./supabaseClient";

export async function addFavorite(movieId: number) {
    const { data, error } = await supabase
        .from("favorites")
        .insert([{ user_id: (await supabase.auth.getUser()).data.user?.id, movie_id: movieId }]);

    if (error) throw error;
    return data;
}

export async function removeFavorite(movieId: number) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("movie_id", movieId);

    if (error) throw error;
    return data;
}

export async function getFavorites() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return [];

    const { data, error } = await supabase
        .from("favorites")
        .select("movie_id")
        .eq("user_id", user.id);

    if (error) throw error;
    return data.map((f) => f.movie_id);
}
