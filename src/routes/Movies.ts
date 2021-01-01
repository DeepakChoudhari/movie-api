import { StatusCodes } from 'http-status-codes';
import { Request, Response, Router } from 'express';

const router: Router = Router();

router.get('', (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({ data: `${new Date()}` });
});

router.get('/:year', (req: Request, res: Response) => {
    const { year } = req.params;
    return res.status(StatusCodes.OK).json({ year, data: `${new Date()}` });
});

export default router;
