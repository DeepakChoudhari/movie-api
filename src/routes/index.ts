import { IMovieDbContext, MovieDbContext } from '@dataaccess/movieDbContext';
import logger from '@shared/logger';
import { Router } from 'express';
import { MovieRoutes } from './movies';
import { createMovieRequestSchema, validatorFn } from './requestValidators';

// Init router and path
const router = Router();
const movieRepository: IMovieDbContext = new MovieDbContext(logger);
const movieRoutes: MovieRoutes = new MovieRoutes(movieRepository, logger);

// Add sub-routes
router.get('/movies', async (req, res) => await movieRoutes.getAllMovies(req, res));
router.post('/movies', validatorFn({ body: createMovieRequestSchema }), async (req, res) => await movieRoutes.postMovie(req, res));
router.get('/movies/:year', async (req, res) => await movieRoutes.getMovieByYear(req, res));

// Export the base-router
export default router;
