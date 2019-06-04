import to from 'await-to-js';

export const createHealthCheck = connection => async () => {
  const [err] = await to(connection.authenticate());

  if (err) {
    throw new Error('Connection to DB lost');
  }
};
