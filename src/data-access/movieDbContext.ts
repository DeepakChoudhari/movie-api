import { IMovie } from '@entities/movie'
import Logger from 'jet-logger';
import AWS from 'aws-sdk';
import { DocumentClient, ExpressionAttributeValueMap, AttributeValue } from 'aws-sdk/clients/dynamodb';
import { AWS_REGION } from '@shared/constants';
import { APIVersions } from 'aws-sdk/lib/config';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

export interface IMovieDbContext {
    create(movie: IMovie): Promise<boolean>;
    get(movie: IMovie): Promise<IMovie|undefined>;
    getMoviesByYear(year: number): Promise<IMovie[]>;
    getAll(): Promise<IMovie[]>;
    update(movie: IMovie): Promise<IMovie|undefined>;
    delete(movie: IMovie): Promise<boolean>;
}

export interface IAwsDocumentClient {
    documentClient: DocumentClient;
    options: AWS.ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions;
}

export class MovieDbContext implements IMovieDbContext {
    private readonly _logger: Logger;
    private readonly _documentClient: DocumentClient;
    public static TableName = 'Movies';

    constructor(logger: Logger, docClient?: IAwsDocumentClient) {
        this._logger = logger;
        if (docClient) {
            AWS.config.update(docClient.options);
            this._documentClient = docClient.documentClient;
        } else {
            AWS.config.update({ region: AWS_REGION });
            this._documentClient = new DocumentClient();
        }
    }

    async create(movie: IMovie): Promise<boolean> {
        try {
            const params = {
                TableName: MovieDbContext.TableName,
                Item: movie
            };
            await this._documentClient.put(params).promise();
            return true;
        } catch (err) {
            this._logger.err(`Error while creating movie item [${JSON.stringify(movie)}]: ${err.message}`);
            return false;
        }
    }

    async get(movie: IMovie): Promise<IMovie|undefined> {
        try {
            const params = {
                TableName: MovieDbContext.TableName,
                Key: {
                    year: Number(movie.year),
                    title: movie.title
                }
            };
            const result = await this._documentClient.get(params).promise();
            return result.Item as IMovie;
        } catch (err) {
            this._logger.err(`Error while retrieving the movie [${JSON.stringify(movie)}]: ${err.message}`);
            return undefined;
        }
    }

    async getMoviesByYear(year: number): Promise<IMovie[]> {
        try {
            const params = {
                TableName: MovieDbContext.TableName,
                KeyConditionExpression: "#yr = :yyyy",
                ExpressionAttributeNames: {
                    "#yr": "year"
                },
                ExpressionAttributeValues: {
                    ":yyyy": Number(year)
                }
            };
            const result = await this._documentClient.query(params).promise();
            return result.Items ? result.Items as IMovie[] : [];
        } catch(ex) {
            this._logger.err(`Error while retrieving movies by year [${year}]: ${ex.message}`);
            throw new Error(`Server error occurred while retrieving movies by year ${year}`);
        }
    }

    async getAll(): Promise<IMovie[]> {
        try {
            const params = {
                TableName: MovieDbContext.TableName
            };
            const result = await this._documentClient.scan(params).promise();
            return result.Items ? result.Items as IMovie[] : [];
        } catch(ex) {
            this._logger.err(`Error while retrieving all movies: ${ex.message}`);
            throw new Error(`Server error occurred while retrieving all movies`);
        }
    }

    async update(movie: IMovie): Promise<IMovie|undefined> {
        try {
            const updateExpression: string[] = ['set'];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const expressionAttributeValues: ExpressionAttributeValueMap = {};
            if (!movie.info) {
                this._logger.info(`Insufficient data to update the movie [${JSON.stringify(movie)}]`);
                return undefined;
            }
            if (movie.info.directors) {
                updateExpression.push('info.directors = :directors');
                expressionAttributeValues[':directors'] = movie.info.directors as AttributeValue;
            }
            if (movie.info.release_date) {
                updateExpression.push('info.release_date = :releasedate');
                expressionAttributeValues[':releasedate'] = movie.info.release_date as AttributeValue;
            }
            if (movie.info.genres) {
                updateExpression.push('info.genres = :genres');
                expressionAttributeValues[':genres'] = movie.info.genres as AttributeValue;
            }
            if (movie.info.image_url) {
                updateExpression.push('info.image_url = :imageurl');
                expressionAttributeValues[':imageurl'] = movie.info.image_url as AttributeValue;
            }
            if (movie.info.plot) {
                updateExpression.push('info.plot = :plot');
                expressionAttributeValues[':plot'] = movie.info.plot as AttributeValue;
            }
            if (movie.info.rank) {
                updateExpression.push('info.rank = :rank');
                expressionAttributeValues[':rank'] = movie.info.rank as AttributeValue;
            }
            if (movie.info.actors) {
                updateExpression.push('info.actors = :actors');
                expressionAttributeValues[':actors'] = movie.info.actors as AttributeValue;
            }
            if (movie.info.running_time_secs) {
                updateExpression.push('info.running_time_secs = :runningtime');
                expressionAttributeValues[':runningtime'] = movie.info.running_time_secs as AttributeValue;
            }
            if (movie.info.rating) {
                updateExpression.push('info.rating = :rating');
                expressionAttributeValues[':rating'] = movie.info.rating as AttributeValue;
            }
            const params = {
                TableName: MovieDbContext.TableName,
                Key: {
                    'year': movie.year,
                    'title': movie.title
                },
                UpdateExpression: updateExpression.join(' '),
                ExpressionAttributeValues: expressionAttributeValues,
                ReturnValues: 'UPDATED_NEW'
            };
            const result = await this._documentClient.update(params).promise();
            return result.Attributes as IMovie
        } catch (err) {
            this._logger.err(`Error updating movie item [${JSON.stringify(movie)}]: ${err.message}`);
            return undefined;
        }
    }

    async delete(movie: IMovie): Promise<boolean> {
        try {
            const params = {
                TableName: MovieDbContext.TableName,
                Key: {
                    'year': movie.year,
                    'title': movie.title
                }
            };
            await this._documentClient.delete(params).promise();
            return true;
        } catch (err) {
            this._logger.err(`Error deleting movie item [${JSON.stringify(movie)}]: ${err.message}`);
            return false;
        }
    }
}
