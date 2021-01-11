import { IMovie } from '@entities/movie'
import Logger from 'jet-logger';
import AWS from 'aws-sdk';
import { AWS_REGION } from '@shared/constants';

export interface IMovieDbContext {
    create(movie: IMovie): Promise<boolean>;
    get(movie: IMovie): Promise<IMovie>;
    update(movie: IMovie): Promise<boolean>;
    delete(movie: IMovie): Promise<boolean>;
}

export interface IAwsDocumentClient {
    documentClient: AWS.DynamoDB.DocumentClient;
    region?: string;
}

export class MovieDbContext implements IMovieDbContext {
    private readonly logger: Logger;
    private readonly documentClient: AWS.DynamoDB.DocumentClient;
    private static TableName = 'Movies';
    
    constructor(logger: Logger, docClient?: IAwsDocumentClient) {
        this.logger = logger;
        AWS.config.update({ region: AWS_REGION });
        if (docClient) {
            this.documentClient = docClient.documentClient;
            if (docClient.region) {
                AWS.config.update({ region: docClient.region });
            }
        } else {
            this.documentClient = new AWS.DynamoDB.DocumentClient();
        }
    }

    async create(movie: IMovie): Promise<boolean> {
        try {
            const params = {
                TableName: MovieDbContext.TableName,
                Item: movie
            };
            await this.documentClient.put(params).promise();
            return true;
        } catch (err) {
            this.logger.err(`Error while creating movie: ${err.message}`);
            return false;
        }
    }

    async get(movie: IMovie): Promise<IMovie> {
        throw new Error("Method not implemented.");
    }

    async update(movie: IMovie): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async delete(movie: IMovie): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
