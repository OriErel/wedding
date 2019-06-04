import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

export const middlewares = [cookieParser(), bodyParser.json(), bodyParser.urlencoded({ extended: true }), compression()];
