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
            secretAccessKey: Environment.awsSecretAccessKey(),
            accessKeyId: Environment.awsAccessKeyId()
        },
        dynamodb: {
            endpoint: Environment.awsDynamoDbEndpoint()
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

router.get('/movies/year/:year', async (req, res) => await movieRoutes.getMoviesByYear(req, res));

router.get('/movies/year/:year/title/:title', async (req, res) => await movieRoutes.getMovieByYearAndTitle(req, res));

router.patch('/movies', async (req, res) => await movieRoutes.update(req, res));

// Export the base-router
export default router;
