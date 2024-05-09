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
router.get(
  '/single/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  EventController.getSingleEvent,
);
router.patch(
  '/edit/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  EventController.updateEvent,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  EventController.deleteEvent,
);
export const EventRoutes = router;
