import { toast } from 'sonner';

import { GeneralResponse } from 'Interfaces/common';
import logger from 'Utils/logger';

export const okOrErrResponseWrapper = async (promise: Promise<GeneralResponse>) => {
  const res = await promise;

  if (res.Err) {
    logger.error(`Canister call failed, ${res.Err}`);
    throw new Error(`Canister call failed, ${res.Err}`);
  }

  return res.Ok;
};

export const toastWrapper = async (promise: Promise<any>, notifyPrefix?: string) => {
  return new Promise((resolve, reject) => {
    toast.promise(promise, {
      loading: `${notifyPrefix ? notifyPrefix + ' p' : 'P'}rocessing...`,
      success: (data) => {
        resolve(data);
        return `${notifyPrefix ? notifyPrefix + ' p' : 'P'}rocessed successfully ${data ? `:${data}` : ''}`;
      },
      error: (data) => {
        logger.error(`${notifyPrefix ? notifyPrefix + ' f' : 'F'}ailed ${data}`);
        reject(data);
        return `${notifyPrefix ? notifyPrefix + ' f' : 'F'}ailed. Try again later.`;
      },
    });
  });
};
