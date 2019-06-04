import * as awilix from 'awilix';
import { connect } from 'db';

import { logger } from './shims/logger.shim';

export const create = async () => {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  const db = connect({
    host: 'db',
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  // We can't do connection.options.logging = logger.info; because sequelize log function adds the
  // SQL query object as well and logging it using winston throws an error Cannot find module 'pg-native'.
  // We currently don't need it because we only use console.log, we will need it at some point for advanced logging
  db.connection.options.logging = log => logger.info(log);

  container.register({
    db: awilix.asValue(db),
  });

  return [container];
};
