import { Router } from 'express';
import MovieRouter from './movies';

// Init router and path
const router = Router();

// Add sub-routes
router.use(MovieRouter);

// Export the base-router
export default router;
