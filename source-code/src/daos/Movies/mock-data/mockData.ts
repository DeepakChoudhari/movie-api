import { IMovie } from '@entities/Movie';
import jsonfile from 'jsonfile';
import logger from '@shared/Logger';
import path from 'path';

const mockDataFilePath = path.join(__dirname, 'mock-data.json');

export async function loadMockData(): Promise<IMovie[]> {
    let movies: IMovie[] = [];
    try {
        logger.info('Loading mock data...');
        movies = await jsonfile.readFile(mockDataFilePath) as IMovie[];
        logger.info('Mock data loaded.');
    } catch(e) {
        logger.err(`Error occurred while loading mock data: ${e}`, true);
    }

    return movies;
}

export function loadMockDataSync(): IMovie[] {
    let movies: IMovie[] = [];
    try {
        logger.info('Loading mock data...');
        movies = jsonfile.readFileSync(mockDataFilePath) as IMovie[];
        logger.info('Mock data loaded.');
    } catch(e) {
        logger.err(`Error occurred while loading mock data: ${e}`, true);
    }

    return movies;
}
