const TMDB_API_KEY = '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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
