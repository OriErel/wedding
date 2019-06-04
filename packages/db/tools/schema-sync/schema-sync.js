import Sequelize from 'sequelize';

import { createConnection } from '../../src/connection';
import { createModels } from '../../src/models';

createConnection({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
})
  .then(connection => {
    createModels(connection, { connection, Sequelize });
    connection.sync({ force: process.env.DB_FORCE_SYNC === '1' }); // CAUTION! will drop all tables
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
