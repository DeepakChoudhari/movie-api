export const paramMissingError = 'One or more of the required parameters was missing.';

export class Environment {
    static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }

    static isTest(): boolean {
        return process.env.NODE_ENV === 'test';
    }

    static awsSecretAccessKey(): string {
        return process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : '';
    }

    static awsAccessKeyId() : string {
        return process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID : '';
    }

    static awsDynamoDbEndpoint(): string {
        return process.env.AWS_DYNAMODB_ENDPOINT ? process.env.AWS_DYNAMODB_ENDPOINT : '';
    }
}

export const AWS_REGION = 'us-east-1';
