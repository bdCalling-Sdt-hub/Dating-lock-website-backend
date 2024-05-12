import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';

const router = express.Router();
//!User
router.post('/register', UserController.registrationUser);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.get('/users', auth(ENUM_USER_ROLE.USER), UserController.getAllUsers);
router.get(
  '/role-base',
  auth(ENUM_USER_ROLE.USER),
  UserController.userBaseOnGender,
);
router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.USER),
  UserController.changePassword,
);
router.post('/forgot-password', UserController.forgotPass);
router.post('/reset-password', UserController.resetPassword);

//!IDS Work
router.get('/profile/:id', UserController.getSingleUser);
router.patch('/edit-profile/:id', uploadFile(), UserController.updateProfile);

export const UserRoutes = router;
