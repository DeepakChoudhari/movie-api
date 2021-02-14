export interface IMovie {
    year: number;
    title: string;
    info?: IMovieInfo;
}

export interface IMovieInfo {
    directors: string[];
    release_date: string;
    genres: string[];
    image_url: string;
    plot: string;
    rank: number;
    actors: string[];
    running_time_secs?: number;
    rating?: number;
}