import bodyParser from 'body-parser';
import express from 'express';
import limiter from '../middlewares/rate-limiter';
import validateRequest from '../validators';
import compositionHandler from './composition.handler';
import imageHandler from './image.handler';

const jsonParser = bodyParser.json();

const router = () => {
  const route = express.Router();
  route.post('/', limiter, jsonParser, validateRequest, compositionHandler);
  route.get('/inventory.png', limiter, imageHandler);

  return route;
};

export default router;
