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

export const toastWrapper = async (promise: Promise<any>) => {
  return new Promise((resolve, reject) => {
    toast.promise(promise, {
      loading: 'Processing...',
      success: (data) => {
        resolve(data);
        return `Processed successfully ${data ? `:${data}` : ''}`;
      },
      error: (data) => {
        logger.error(`Failed ${data}`);
        reject(data);
        return `Failed. Try again later.`;
      },
    });
  });
};