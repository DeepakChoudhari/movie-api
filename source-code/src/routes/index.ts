import { Router } from 'express';
import MovieRouter from './Movies';

// Init router and path
const router = Router();

// Add sub-routes
router.use("/movies", MovieRouter);

// Export the base-router
export default router;
