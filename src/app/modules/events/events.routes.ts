import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { uploadFile } from '../../middlewares/fileUploader';
import { EventController } from './events.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { EventValidation } from './events.validations';
const router = express.Router();
router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  uploadFile(),
  validateRequest(EventValidation.post),
  EventController.addEvent,
);
router.post('/join', auth(ENUM_USER_ROLE.USER), EventController.joinEvents);
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
  uploadFile(),
  validateRequest(EventValidation.update),
  EventController.updateEvent,
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  EventController.deleteEvent,
);
router.delete(
  '/remove-user/:eventId/:userId',
  auth(ENUM_USER_ROLE.ADMIN),
  EventController.removeFromEvent,
);
export const EventRoutes = router;
