import express from 'express';
import auth from '../../middlewares/auth';
import { SubscriptionsController } from './subscriptions.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  SubscriptionsController.adSubscriptions,
);
router.post(
  '/add-item',
  auth(ENUM_USER_ROLE.ADMIN),
  SubscriptionsController.adSubscriptionsItem,
);
router.get(
  '/all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  SubscriptionsController.getSubscriptions,
);
router.delete(
  '/delete-item/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  SubscriptionsController.deleteSubscriptionsTitle,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  SubscriptionsController.deleteSubscriptions,
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  SubscriptionsController.updateSubscriptionsTitle,
);

export const SubscriptionRoutes = router;
