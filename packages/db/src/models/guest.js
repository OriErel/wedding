import compose from 'compose-function';
import Sequelize from 'sequelize';

import { extractFunction } from '../extensions/extract';
import { defaultParameters } from '../extensions/default-parameters';

export const register = connection => {
  const GuestModel = connection.define(
    'guest',
    {
      id: { type: Sequelize.STRING, primaryKey: true },
      firstName: {
        field: 'first_name',
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        field: 'last_name',
        type: Sequelize.STRING,
        allowNull: false,
      },
      cellphone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rsvp: {
        type: Sequelize.ENUM,
        values: Object.values(['ATTENDING', 'NOT ATTENDING']),
      },
      amountOfPeople: {
        field: 'amount_of_people',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING,
      },
    },
    defaultParameters(),
  );

  const Guest = compose(extractFunction)(GuestModel);

  return { Guest };
};
