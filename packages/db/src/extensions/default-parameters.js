import merge from 'lodash.merge';

export const defaultParameters = base =>
  merge(base || {}, {
    timestamps: true,
    paranoid: true,
    underscored: true,
  });
