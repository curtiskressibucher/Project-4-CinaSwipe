const TMDB_API_KEY = 'YOUR_TMDB_API';
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
export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        if (response.ok) {
            const movie = {
                id: data.id,
                title: data.title,
                original_title: data.original_title,
                release_date: data.release_date,
                overview: data.overview,
                poster_path: data.poster_path,
                backdrop_path: data.backdrop_path,
                popularity: data.popularity,
                vote_average: data.vote_average,
                vote_count: data.vote_count,
                runtime: data.runtime,
            };
            return movie;
        } else {
            console.error('Error fetching movie details: ', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching movie details: ', error);
        throw error;
    }
};
