const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL;

export const fetchPopularMovies = async () => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies: ', error);
        throw error;
    }
};

export const fetchMovieGenres = async () => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        console.log(data.genres);
        return data.genres;
    } catch (error) {
        console.error('Error fetching movie genres: ', error);
        throw error;
    }
};

export const fetchMoviesByGenre = async (genreId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genreId}&sort_by=popularity.desc`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error(`Error fetching movies for genre ${genreId}: `, error);
        throw error;
    }
};
export const fetchMovieDetailsById = async (movieId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            `Error fetching movie details for ID ${movieId}: `,
            error
        );
        throw error;
    }
};

export const fetchMovieById = async (movieId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching movie with ID ${movieId}: `, error);
        throw error;
    }
};
