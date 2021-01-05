export const paramMissingError = 'One or more of the required parameters was missing.';

export class Environment {
    static isDevelopment(): boolean {
        return process.env.NODE_ENV === 'development';
    }
}
