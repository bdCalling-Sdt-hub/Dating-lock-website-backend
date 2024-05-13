import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { BlogController } from './blog.controller';
import { BlogLikeCommentController } from '../blog-like-comment/blog_like.controller';
const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  BlogController.addBlog,
);
router.post(
  '/add-like',
  auth(ENUM_USER_ROLE.USER),
  BlogLikeCommentController.addLike,
);
router.post(
  '/add-comment',
  auth(ENUM_USER_ROLE.USER),
  BlogLikeCommentController.addComment,
);
router.get(
  '/get-all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BlogController.getBlogs,
);
router.get(
  '/single/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BlogController.getSingleBlog,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  BlogController.deleteBlog,
);
router.delete(
  '/delete-comment/:postId/:commentId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BlogLikeCommentController.deleteComment,
);
router.delete(
  '/delete-like/:postId/:likeId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BlogLikeCommentController.removeLike,
);
router.patch(
  '/edit/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  BlogController.updateBlog,
);

export const BlogRoutes = router;
