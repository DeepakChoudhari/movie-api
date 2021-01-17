import { StatusCodes } from 'http-status-codes';
import { IRouter, Request, Response } from 'express';
import { IMovieDbContext } from '@dataaccess/movieDbContext';
import logger from '@shared/logger';
import { IMovie } from '@entities/movie';
import Logger from 'jet-logger';

/**
 * Class definition for all request handlers
 */
export class MovieRoutes {
    private readonly router: IRouter;
    private readonly movieRepository: IMovieDbContext;
    private readonly logger: Logger;

    constructor(router: IRouter, movieRepository: IMovieDbContext, logger: Logger) {
        this.router = router;
        this.movieRepository = movieRepository;
        this.logger = logger;
    }

    /**
     * POST /api/v1/movie
     * @param req Request object
     * @param res Response object
     */
    async postMovie(req: Request, res: Response): Promise<Response> {
        logger.info(`Creating movie: ${JSON.stringify(req.body)}`);
        const movie = <IMovie>req.body;
        const result = await this.movieRepository.create(movie);
        
        return result? res.status(StatusCodes.CREATED).json() : 
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
     * GET /api/v1/movie/2001
     * @param req Request object
     * @param res Response object
     */
    async getMovieByYear(req: Request, res: Response): Promise<Response> {
        const { year } = req.params;
        return res.status(StatusCodes.OK).json({ year, data: `${new Date()}` });    
    }
}
