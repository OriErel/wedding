import merge from 'lodash.merge';

export const indexes = indexesToApply => base =>
  merge(base || {}, {
    indexes: indexesToApply,
  });
