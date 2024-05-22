const basePickBy = function(object, paths, predicate) {
  const result = {};

  paths.forEach((path) => {
    if (predicate(object[path], path)) {
      result[path] = object[path];
    }
  });

  return result;
};

export default basePickBy;
