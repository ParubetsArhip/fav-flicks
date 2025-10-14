import axios from "axios";
import type {Movie} from "../types/movie.ts";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: "en-US",
    }
})

export const fetchPopularMovies = async (page = 1) => {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch movies");
    return res.json();
};

export const searchMovies = async (query: string, page = 1) => {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`);
    if (!res.ok) throw new Error("Failed to search movies");
    return res.json();
};

export async function fetchMovieById(id: number): Promise<Movie> {
    const res = await tmdb.get(`/movie/${id}`);
    return res.data;
}



// Что делает axios.create():
//
// Создает новый экземпляр axios с предустановленными настройками
// Все запросы через этот клиент будут использовать эти настройки
//
// Аналогия:
//     Создаете "фирменного курьера" который:
//
//     Знает базовый адрес (baseURL)
// Всегда носит с собой пропуск (api_key)
// Говорит на английском (language: "en-US")





// Популярные фильмы: https://api.themoviedb.org/3/movie/popular
// Поиск: https://api.themoviedb.org/3/search/movie
// Детали фильма: https://api.themoviedb.org/3/movie/123

