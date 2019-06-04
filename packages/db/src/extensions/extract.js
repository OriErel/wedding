const valueReduce = (instance, acc, key) => {
  if (typeof key === 'object') {
    const context = instance[key.field];

    const fieldName = key.renameTo || key.field;

    if (!context) {
      return acc;
    }

    if (Array.isArray(context)) {
      const extractNewValue = subContext =>
        key.rawAttributes ? key.rawAttributes.reduce(valueReduce.bind(null, subContext), {}) : context;

      return {
        ...acc,
        [fieldName]: context.map(extractNewValue),
      };
    }

    const newValue = key.rawAttributes ? key.rawAttributes.reduce(valueReduce.bind(null, context), {}) : context;

    return {
      ...acc,
      [fieldName]: newValue,
    };
  }

  return {
    ...acc,
    [key]: instance[key],
  };
};

export const extractFunction = Model => {
  Model.prototype.extract = function(attributes) {
    return attributes.reduce(valueReduce.bind(null, this), {});
  };

  return Model;
};
