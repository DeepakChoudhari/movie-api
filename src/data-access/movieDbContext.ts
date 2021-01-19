import { IMovie } from '@entities/movie'
import Logger from 'jet-logger';
import AWS, { ConfigurationOptions } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWS_REGION } from '@shared/constants';
import { APIVersions } from 'aws-sdk/lib/config';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

export interface IMovieDbContext {
    create(movie: IMovie): Promise<boolean>;
    get(movie: IMovie): Promise<IMovie|undefined>;
    update(movie: IMovie): Promise<IMovie|undefined>;
    delete(movie: IMovie): Promise<boolean>;
}

export interface IAwsDocumentClient {
    documentClient: DocumentClient;
    region?: string;
    endpoint?: string;
}

export class MovieDbContext implements IMovieDbContext {
    private readonly _logger: Logger;
    private readonly _documentClient: DocumentClient;
    public static TableName = 'Movies';
    
    constructor(logger: Logger, docClient?: IAwsDocumentClient) {
        this._logger = logger;
        AWS.config.update({ region: AWS_REGION });
        if (docClient) {
            let options: ConfigurationOptions & ConfigurationServicePlaceholders & APIVersions;
            if (docClient.region) {
                options = { region: docClient.region };
                if (docClient.endpoint) {
                    options.dynamodb = { endpoint: docClient.endpoint };
                }
            }
            this._documentClient = docClient.documentClient;
        } else {
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
                    'year': movie.year,
                    'title': movie.title
                }
            };
            const result = await this._documentClient.get(params).promise();
            return result.Item as IMovie;
        } catch (err) {
            this._logger.err(`Error while retrieving the movie [${JSON.stringify(movie)}]: ${err.message}`);
            return undefined;
        }
    }

    async update(movie: IMovie): Promise<IMovie|undefined> {
        try {
            const updateExpression: string[] = ['set'];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const expressionAttributeValues = new Map<string, any>();
            if (!movie.info) {
                this._logger.info(`Insufficient data to update the movie [${JSON.stringify(movie)}]`);
                return undefined;
            }
            if (movie.info.directors) {
                updateExpression.push('info.directors=:d');
                expressionAttributeValues.set(':d', movie.info.directors);
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
