import express from 'express';
import { SubscribeController } from './subscribe.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post('/send', SubscribeController.insertIntoDB);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.ADMIN),
  SubscribeController.getSubscribeData,
);

export const subscribeRoutes = router;
