const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isType = (type) => ['work', 'personal', 'home'].includes(type);
  if (isType(type)) return type;
};

const parseBoolean = (isFavourite) => {
  if (typeof isFavourite === 'string') {
    if (isFavourite === 'true') return true;
    if (isFavourite === 'false') return false;
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  const parsedType = parseType(type);
  const parsedBoolean = parseBoolean(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedBoolean,
  };
};
