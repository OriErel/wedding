import winston from 'winston';
import expressWinston from 'express-winston';

import get from 'lodash.get';

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const MSG = 'HTTP {{req.method}} {{req.url}} latency={{(res.responseTime / 1000).toFixed(5)}}';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({
          format: 'YY-MM-DD HH:mm:ss.sss',
        }),
        winston.format.printf(info => {
          let metaAddon;
          let { res } = info.meta || {};
          const { error, req } = info.meta || {};

          if (get(res, 'body.length') > 5000) {
            res = { ...res, body: '";<AltTooLong>;"' };
          }

          try {
            metaAddon = info.meta ? ` ${JSON.stringify({ error, req, res })}` : '';
          } catch (e) {
            metaAddon = ` ${JSON.stringify({
              error: { message: error.message, stack: error.stack },
              req,
              res,
            })}`;
          }

          return `[${info.timestamp}] ${info.level}: ${info.message}${metaAddon}`;
        }),
      ),
    }),
  ],
});

export const middlewares = {
  logger: expressWinston.logger({
    msg: MSG,
    winstonInstance: logger,
    colorize: true,
  }),
  errorLogger: expressWinston.errorLogger({
    msg: MSG,
    level: 'error',
    winstonInstance: logger,
    colorize: true,
  }),
};
