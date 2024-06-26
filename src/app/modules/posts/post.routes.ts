import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PostController } from './post.controller';
import { uploadFile } from '../../middlewares/fileUploader';
import { validateRequest } from '../../middlewares/validateRequest';
import { PostValidation } from './post.validation';

const router = express.Router();

router.post(
  '/add-post',
  auth(ENUM_USER_ROLE.USER),
  uploadFile(),
  validateRequest(PostValidation.post),
  PostController.createPost,
);
router.get('/my-posts', auth(ENUM_USER_ROLE.USER), PostController.getMyPosts);
router.get(
  '/single-post/:id',
  auth(ENUM_USER_ROLE.USER),
  PostController.singlePost,
);
router.delete(
  '/delete-post/:id',
  auth(ENUM_USER_ROLE.USER),
  PostController.deletePost,
);
router.patch(
  '/edit-post/:id',
  auth(ENUM_USER_ROLE.USER),
  uploadFile(),
  validateRequest(PostValidation.update),
  PostController.updatePost,
);

export const PostRoutes = router;
