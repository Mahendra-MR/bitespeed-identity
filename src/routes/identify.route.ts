import { Router } from 'express';
import { identifyController } from '../controllers/identify.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.post('/identify', asyncHandler(identifyController));

export default router;
