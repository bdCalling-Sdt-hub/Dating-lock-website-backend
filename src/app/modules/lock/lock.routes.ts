import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { LockController } from './lock.controller';
const router = express.Router();

router.post(
  '/send-request',
  auth(ENUM_USER_ROLE.USER),
  LockController.requestLock,
);
router.patch(
  '/accept-request',
  auth(ENUM_USER_ROLE.USER),
  LockController.acceptLock,
);
router.patch(
  '/reject-request',
  auth(ENUM_USER_ROLE.USER),
  LockController.rejectLock,
);
router.get('/lists', auth(ENUM_USER_ROLE.USER), LockController.myLockList);
router.get(
  '/pending-list',
  auth(ENUM_USER_ROLE.USER),
  LockController.myPendingLock,
);
router.get(
  '/requested-list',
  auth(ENUM_USER_ROLE.USER),
  LockController.myRequestedLock,
);
router.delete(
  '/delete-lock/:id',
  auth(ENUM_USER_ROLE.USER),
  LockController.deleteLock,
);

export const LockRoutes = router;
