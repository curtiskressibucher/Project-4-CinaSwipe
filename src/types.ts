export type Movie = {
    id: number;
    title: string;
    original_title: string;
    release_date: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    popularity: number;
    vote_average: number;
    vote_count: number;
    runtime: number;
};

export default Movie;
