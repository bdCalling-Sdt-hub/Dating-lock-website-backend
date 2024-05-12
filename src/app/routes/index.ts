import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { PostRoutes } from '../modules/posts/post.routes';
import { LockRoutes } from '../modules/lock/lock.routes';
import { BlogRoutes } from '../modules/blog/blog.routes';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { EventRoutes } from '../modules/events/events.routes';
import { SubscriptionPlanRoutes } from '../modules/subscriptions-plan/subscriptions-plan.routes';
import { ReviewRoutes } from '../modules/reviews/reviews.routes';
import { subscribeRoutes } from '../modules/subscribe/subscribe.routes';
import { FeedbackRoutes } from '../modules/feedback/feedback.routes';
import { MessageRoutes } from '../modules/messages/message.routes';
import { SubscriptionRoutes } from '../modules/subscriptions/subscriptions.routes';

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
    path: '/subscription-plan',
    route: SubscriptionPlanRoutes,
  },
  {
    path: '/subscriptions',
    route: SubscriptionRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/subscribe',
    route: subscribeRoutes,
  },
  {
    path: '/feedback',
    route: FeedbackRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/message',
    route: MessageRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
