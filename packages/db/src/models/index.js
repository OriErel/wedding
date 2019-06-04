import compose from 'compose-function';

import { register as guestRegister } from './guest';

const connectify = (fn, connection) => services => Object.assign(services, fn(connection, services));

export const createModels = (connection, extra = {}) => compose(connectify(guestRegister, connection))(extra);
