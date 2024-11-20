const parseNumber = (number, defaultvalue) => {
  const isString = typeof number === 'string';
  if (!isString) return defaultvalue;
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return defaultvalue;
  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerpage = parseNumber(perPage, 10);
  return {
    page: parsedPage,
    perPage: parsedPerpage,
  };
};
