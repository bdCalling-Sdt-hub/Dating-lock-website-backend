import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { BlogController } from './blog.controller';
const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  BlogController.addBlog,
);

export const BlogRoutes = router;
