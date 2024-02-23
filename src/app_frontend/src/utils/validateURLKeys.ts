import { ApiKey } from 'Interfaces/feed';

export const validateUrlKeys = (url: string, keysArray: ApiKey[]) => {
  const regex = /\{\w+\}/g;
  const matchCount = (url.match(regex) || []).length;

  return matchCount === keysArray.length;
};
