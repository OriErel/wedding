import errorhandler from 'errorhandler';

const productionHandler = (error, req, res) => {
  res.status(500).send({ message: 'Internal server error' });
};

export const middlewares = {
  errorHandler: process.env.NODE_ENV === 'production' ? productionHandler : errorhandler(),
};
