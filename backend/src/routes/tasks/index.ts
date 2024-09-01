import { getRouter } from 'services/router_factory';
import { getTaskLists } from './api';
import { taskCountMiddleware } from './middleware';

const router = getRouter();

router.get('/lists', [taskCountMiddleware.validate], getTaskLists);
router.get('/lists/:id', [taskCountMiddleware.validate], getTaskLists); // TODO

export default router;
