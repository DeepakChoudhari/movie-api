import { IMovieDbContext, MovieDbContext } from '@dataaccess/movieDbContext';
import { AWS_REGION, Environment } from '@shared/constants';
import logger from '@shared/logger';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Router } from 'express';
import { MovieRoutes } from './movies';
import { createMovieRequestSchema, validatorFn } from './requestValidators';

// Init router
const router = Router();
let movieRepository: IMovieDbContext;
if (Environment.isDevelopment() || Environment.isTest()) {
    const options = {
        region: AWS_REGION,
        credentials: {
            secretAccessKey: "abcd",
            accessKeyId: "1234"
        },
        dynamodb: {
            endpoint: 'http://localhost:8000'
        }
    };
    const documentClient: DocumentClient = new DocumentClient({
        region: options.region,
        credentials: options.credentials,
        endpoint: options.dynamodb.endpoint,
    });
    movieRepository = new MovieDbContext(logger, { documentClient, options });
} else {
    movieRepository = new MovieDbContext(logger);
}
const movieRoutes: MovieRoutes = new MovieRoutes(movieRepository, logger);

// Add sub-routes
router.get('/movies', async (req, res) => await movieRoutes.getAllMovies(req, res));
router.post('/movies', validatorFn({ body: createMovieRequestSchema }), async (req, res) => await movieRoutes.postMovie(req, res));
router.get('/movies/:year', async (req, res) => await movieRoutes.getMovieByYear(req, res));

// Export the base-router
export default router;
