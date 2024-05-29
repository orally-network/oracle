import basePickBy from './basePickBy';

const omitBy = function(object, predicate) {
  if (!object) {
    return {};
  }

  return basePickBy(object, Object.keys(object), (value, path) => {
    return !predicate(value, path);
  });
};

export default omitBy;
