import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { PostRoutes } from '../modules/posts/post.routes';
import { LockRoutes } from '../modules/lock/lock.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { EventRoutes } from '../modules/events/events.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/lock',
    route: LockRoutes,
  },
  {
    path: '/blog',
    route: BlogRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/manage',
    route: ManageRoutes,
  },
  {
    path: '/event',
    route: EventRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
