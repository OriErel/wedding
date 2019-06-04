/* eslint-disable prefer-destructuring */
const Sequelize = require('sequelize');

let createConnection, createModels, createHealthCheck;

if (process.env.NODE_ENV === 'production') {
  createModels = require('./dist/models').createModels;
  createConnection = require('./dist/connection').createConnection;
  createHealthCheck = require('./dist/health').createHealthCheck;
} else {
  createModels = require('./src/models').createModels;
  createConnection = require('./src/connection').createConnection;
  createHealthCheck = require('./src/health').createHealthCheck;
}

module.exports = {
  connect: config => {
    const connection = createConnection(config);
    const healthCheck = createHealthCheck(connection);

    return createModels(connection, { connection, healthCheck, Sequelize });
  },
};
/* eslint-enable prefer-destructuring */
