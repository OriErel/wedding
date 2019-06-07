import compose from 'compose-function';
import Sequelize from 'sequelize';

import { extractFunction } from '../extensions/extract';
import { defaultParameters } from '../extensions/default-parameters';

export const register = connection => {
  const SysAdminModel = connection.define(
    'sysadmin',
    {
      id: { type: Sequelize.STRING, primaryKey: true },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    defaultParameters(),
  );

  const SysAdmin = compose(extractFunction)(SysAdminModel);

  return { SysAdmin };
};
