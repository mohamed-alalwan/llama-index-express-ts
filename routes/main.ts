import { Router } from 'express';
import { post_send_message } from '../controllers/main';

const mainRouter: Router = Router();

mainRouter.post('/', post_send_message);

export { mainRouter };