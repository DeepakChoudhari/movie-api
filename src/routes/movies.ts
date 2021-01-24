import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { IMovieDbContext } from '@dataaccess/movieDbContext';
import { IMovie } from '@entities/movie';
import Logger from 'jet-logger';

/**
 * Class definition for all request handlers
 */
export class MovieRoutes {
    private readonly _movieRepository: IMovieDbContext;
    private readonly _logger: Logger;

    constructor(movieRepository: IMovieDbContext, logger: Logger) {
        this._movieRepository = movieRepository;
        this._logger = logger;
    }

    /**
     * POST /api/v1/movie
     * @param req Request object
     * @param res Response object
     */
    async postMovie(req: Request, res: Response): Promise<Response> {
        this._logger.info(`Creating movie: ${JSON.stringify(req.body)}`);
        const movie = <IMovie>req.body;
        const result = await this._movieRepository.create(movie);
        
        return result? res.status(StatusCodes.CREATED).json(movie) : 
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json();          
    }

    /**
     * GET /api/v1/movies
     * @param req Request object
     * @param res Response object
     */
    async getAllMovies(req: Request, res: Response): Promise<Response> {
        return res.status(StatusCodes.OK).json({ data: `${new Date()}` });
    }

    /**
     * GET /api/v1/movies/year/2001
     * @param req Request object
     * @param res Response object
     */
    async getMoviesByYear(req: Request, res: Response): Promise<Response> {
        const { year } = req.params;
        return res.status(StatusCodes.OK).json({ year, data: `${new Date()}` });    
    }

    /**
     * GET /api/v1/movies/year/:year/title/:title
     * @param req Request object
     * @param res Response object
     */
    async getMovieByYearAndTitle(req: Request, res: Response): Promise<Response> {
        const { year, title } = req.params;
        return res.status(StatusCodes.OK).json({ year, title });
    }
}
