import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/forgot-password', AuthController.forgotPass);

router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;
