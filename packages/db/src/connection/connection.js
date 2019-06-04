import Sequelize from 'sequelize';

export const createConnection = ({ host, database, username, password }) =>
  new Sequelize(database, username, password, {
    host,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
