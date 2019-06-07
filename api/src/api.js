import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import { create as createContainer } from './container';
import { middlewares as parserMiddlewares } from './shims/parser.shim';
import { middlewares as loggerMiddlewares } from './shims/logger.shim';
import { middlewares as errorMiddlewares } from './shims/error.shim';
import { asHealth, addHealthCheck } from './shims/health.shim';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const init = async () => {
  const api = express();

  api.use(cors());

  const [container] = await createContainer();

  api.use(...parserMiddlewares);
  api.use(loggerMiddlewares.logger);

  api.use(asHealth`/health`);
  addHealthCheck('altdb', container.cradle.db.healthCheck);

  api.use('/api/guest', container.cradle.GuestHandler);

  api.use(loggerMiddlewares.errorLogger);
  api.use(errorMiddlewares.errorHandler);

  return api;
};
