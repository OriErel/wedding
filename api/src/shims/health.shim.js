import to from 'await-to-js';
import pathToRegexp from 'path-to-regexp';

const HEALTH_CHECKS = {};

export const addHealthCheck = (checkName, cb) => (HEALTH_CHECKS[checkName] = async () => cb());

export const asHealth = args => {
  const re = pathToRegexp(args[0]);

  const handler = async (req, res, next) => {
    if (!re.test(req.url)) {
      return next();
    }

    const healthStatus = { errors: [], checks: {} };

    for (const checkName in HEALTH_CHECKS) {
      const [err] = await to(HEALTH_CHECKS[checkName]());

      if (err) {
        healthStatus.errors.push(checkName);
        healthStatus.checks[checkName] = {
          message: err.message,
          stack: err.stack,
        };
      } else {
        healthStatus.checks[checkName] = 'Ok';
      }
    }

    const httpStatus = healthStatus.errors.length > 0 ? 503 : 200;

    res.status(httpStatus).send({ ...healthStatus, status: httpStatus });
  };

  return handler;
};
