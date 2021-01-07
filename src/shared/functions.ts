import logger from './logger';

export const pErr = (err: Error): void => {
    if (err) {
        logger.err(err);
    }
};

export const getRandomInt = (): number => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};
