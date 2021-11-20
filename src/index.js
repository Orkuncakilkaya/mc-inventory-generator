import express from 'express';
import swaggerUI from 'swagger-ui-express';
import router from './handlers';
import swaggerDocument from '../swagger.json';

const app = express();
app.use('/', router());
app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

app.listen(+process.env.PORT || 3000);
