import Sequelize from 'sequelize';

import { createConnection } from '../../src/connection';
import { createModels } from '../../src/models';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '..', '..', '..', '.env') });

try {
  const connection = createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  createModels(connection, { connection, Sequelize });
  connection.sync({ force: process.env.DB_FORCE_SYNC === '1' }); // CAUTION! will drop all tables
} catch (e) {
  console.error(e);
  process.exit(1);
}
