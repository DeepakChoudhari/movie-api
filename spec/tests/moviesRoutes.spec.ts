import supertest, { SuperTest, Test } from 'supertest';
import app from '@server';
import { IMovie } from '@entities/movie';
import AWS, { DynamoDB } from 'aws-sdk';
import { MovieDbContext } from '@dataaccess/movieDbContext';
import logger from '@shared/logger';
import { StatusCodes } from 'http-status-codes';

describe('Integration Tests', () => {
    let sut: SuperTest<Test>;
    let dynamodb: DynamoDB;

    beforeAll(async () => {
        await setupDynamodb();
        sut = supertest(app);
    });

    afterAll(async () => {
        await teardownDynamodb();
    });

    it('POST /api/v1/movies should return 400 status code without "title" attribute', done => {
        sut.post('/api/v1/movies')
        .send({
            "year": 2002
        })
        .expect(StatusCodes.BAD_REQUEST)
        .end((err) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('POST /api/v1/movies should be successful with valid request', done => {
        sut.post('/api/v1/movies')
        .send(movieItem)
        .expect(StatusCodes.CREATED)
        .end((err) => {
            expect(err).toBeFalsy();
            done();
        });
    });

    it('GET /api/v1/movies/year/:year/title/:title should return correct movie item', done => {
        sut.get(`/api/v1/movies/year/${movieItem.year}/title/${movieItem.title}`)
        .send()
        .expect(StatusCodes.OK)
        .end(err => {
            expect(err).toBeFalsy();
            done();
        });
    });

    // it('PATCH /api/v1/movies should update the movie item', done => {
    //     done();
    // });

    // it('DELETE /api/v1/movies should delete the movie item', done => {
    //     done();
    // });

    const movieItem: IMovie = {
        "year": 2013,
        "title": "Rush",
        "info": {
            "directors": ["Ron Howard"],
            "release_date": "2013-09-02T00:00:00Z",
            "rating": 8.3,
            "genres": [
                "Action",
                "Biography",
                "Drama",
                "Sport"
            ],
            "image_url": "http://ia.media-imdb.com/images/M/MV5BMTQyMDE0MTY0OV5BMl5BanBnXkFtZTcwMjI2OTI0OQ@@._V1_SX400_.jpg",
            "plot": "A re-creation of the merciless 1970s rivalry between Formula One rivals James Hunt and Niki Lauda.",
            "rank": 2,
            "running_time_secs": 7380,
            "actors": [
                "Daniel Bruhl",
                "Chris Hemsworth",
                "Olivia Wilde"
            ]
        }
    };

    const setupDynamodb = async (): Promise<void> => {
        AWS.config.update({
            region: "us-east-1",
            credentials: {
                secretAccessKey: "abcd",
                accessKeyId: "1234"
            },
            dynamodb: {
                endpoint: "http://localhost:8000"
            }
        });

        logger.info(`Creating table ${MovieDbContext.TableName}`);
        dynamodb = new DynamoDB();
        if (await tableExists(dynamodb)) return;

        await dynamodb.createTable({
            TableName: "Movies",
            AttributeDefinitions: [
                {
                    AttributeName: "year",
                    AttributeType: "N"
                },
                {
                    AttributeName: "title",
                    AttributeType: "S"
                }
            ],
            KeySchema: [
                {
                    AttributeName: "year",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "title",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }).promise();

        // logger.info(`Setting up Dynamodb with seed data...`);
        // const client = new AWS.DynamoDB.DocumentClient({
        //     region: "us-east-1",
        //     credentials: {
        //         secretAccessKey: "abcd",
        //         accessKeyId: "1234"
        //     },
        //     endpoint: "http://localhost:8000",
        // });

        // await client.put({
        //     TableName: MovieDbContext.TableName,
        //     Item: movieItem
        // }).promise();

        logger.info(`Setting up Dynamodb with seed data completed.`);
    };

    const tableExists = async (dynamodb: DynamoDB): Promise<boolean> => {
        const listTablesOutput = await dynamodb.listTables().promise();
        return listTablesOutput.TableNames ?
            listTablesOutput.TableNames.indexOf(MovieDbContext.TableName) > 0 : false;
    };

    const teardownDynamodb = async (): Promise<void> => {
        logger.info(`Deleting dynamodb table ${MovieDbContext.TableName}`);
        await dynamodb.deleteTable({
            TableName: MovieDbContext.TableName
        }).promise();
        logger.info('Dynamodb table deleted.');
    };
});
