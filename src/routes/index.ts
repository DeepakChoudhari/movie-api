import { IMovieDbContext, MovieDbContext } from '@dataaccess/movieDbContext';
import logger from '@shared/logger';
import { Router } from 'express';
import { MovieRoutes } from './movies';
import { createMovieRequestSchema, validatorFn } from './requestValidators';

// Init router and path
const router = Router();
const movieRepository: IMovieDbContext = new MovieDbContext(logger);
const movieRoutes = new MovieRoutes(router, movieRepository, logger);

// Add sub-routes
router.get('/movies', movieRoutes.getAllMovies);
router.post('/movies', validatorFn({ body: createMovieRequestSchema }), movieRoutes.postMovie);
router.get('/movie/:year', movieRoutes.getMovieByYear);

// Export the base-router
export default router;
