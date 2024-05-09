import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { EventController } from './events.controller';
const router = express.Router();
router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  EventController.addEvent,
);
router.get(
  '/all-events',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EventController.getEvents,
);
export const EventRoutes = router;
