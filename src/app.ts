import express from 'express';
import { mainRouter } from './routers';
import { errorMiddleware } from './utils/errorMiddleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mainRouter);
app.use(errorMiddleware);

export default app;
