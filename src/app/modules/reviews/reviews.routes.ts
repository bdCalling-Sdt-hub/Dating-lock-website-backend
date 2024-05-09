import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ReviewController } from './reviews.controller';
const router = express.Router();

router.post('/add', auth(ENUM_USER_ROLE.USER), ReviewController.addReview);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  ReviewController.getReviews,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
