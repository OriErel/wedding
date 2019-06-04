import compose from 'compose-function';
import Sequelize from 'sequelize';

import { extractFunction } from '../extensions/extract';
import { defaultParameters } from '../extensions/default-parameters';

export const register = connection => {
  const GuestModel = connection.define(
    'guest',
    {
      id: { type: Sequelize.STRING, primaryKey: true },
    },
    defaultParameters(),
  );

  const Guest = compose(extractFunction)(GuestModel);

  return { Guest };
};
