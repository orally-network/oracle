import { ApiKey } from 'Interfaces/feed';

export const validateUrlKeys = (url: string, keysArray: ApiKey[]) => {
  const regex = /(\w+)=\{([^}]+)\}/g; // matches key=value pairs
  const foundKeys = [];

  const matches = Array.from(url.matchAll(regex));

  for (const match of matches) {
    foundKeys.push(match[1]);
  }

  if (foundKeys.length !== keysArray.length) {
    return false;
  }

  for (let i = 0; i < foundKeys.length; i++) {
    const keyTitle = keysArray[i].title;
    if (keyTitle !== foundKeys[i]) {
      return false;
    }
  }

  return true;
};
