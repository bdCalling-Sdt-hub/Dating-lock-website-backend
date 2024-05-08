import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validations';
import { AuthController } from './auth.controller';

const router = express.Router();
router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser,
);
router.post('/forgot-password', AuthController.forgotPass);

router.post('/reset-password', AuthController.resetPassword);

export const AuthRoutes = router;
