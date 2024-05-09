import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { ManageController } from './manage.controller';
const router = express.Router();

router.post(
  '/addAboutUs',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addAboutUs,
);
router.post(
  '/addTermsConditions',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addTermsConditions,
);
router.post(
  '/addContactUs',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addContactUs,
);
router.post(
  '/addPrivacyPolicy',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.addPrivacyPolicy,
);
router.get(
  '/getPrivacyPolicy',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.getPrivacyPolicy,
);
router.get(
  '/getAboutUs',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.getAboutUs,
);
router.get(
  '/getTermsConditions',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.getTermsConditions,
);
router.get(
  '/getContactUs',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.getContactUs,
);
router.patch(
  '/editPrivacyPolicy/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editPrivacyPolicy,
);
router.patch(
  '/editAboutUs/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editAboutUs,
);
router.patch(
  '/editTermsConditions/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editTermsConditions,
);
router.patch(
  '/editContactUs/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.editContactUs,
);
router.delete(
  '/deleteAboutUs/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteAboutUs,
);
router.delete(
  '/deleteContactUs/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteContactUs,
);
router.delete(
  '/deletePrivacyPolicy/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deletePrivacyPolicy,
);
router.delete(
  '/deleteTermsConditions/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManageController.deleteTermsConditions,
);
export const ManageRoutes = router;