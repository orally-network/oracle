import { utils } from 'ethers';
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

// Function to attempt decoding
export const tryDecode = (callData: string) => {
  const bytes = utils.defaultAbiCoder.decode(["bytes"], utils.hexDataSlice(callData, 4));

  try {
    // console.log({ callData, bytes });

    // Attempt to decode as first structure (uint256, uint256[])
    const decoded = utils.defaultAbiCoder.decode(
      ["uint256", "uint256[]"],
      bytes[0],
    );
    // console.log("Decoded as (uint256, uint256[]):", decoded);

    return {
      requestId: decoded[0]._isBigNumber && decoded[0].toNumber(),
      randomWords: decoded[1].map((randomWord: any) => randomWord._isBigNumber && randomWord.toString()),
    }
  } catch (error1) {
    try {
      // If the first attempt fails, try the second structure
      const decoded = utils.defaultAbiCoder.decode(
        ["uint256", "string", "uint256", "uint256", "uint256"],
        bytes[0],
        );
      // console.log("Decoded as (uint256, string, uint256, uint256, uint256):", decoded);

      return {
        requestId: decoded[0]._isBigNumber && decoded[0].toNumber(),
        dataFeedId: decoded[1],
        rate: decoded[2]._isBigNumber && decoded[2].toNumber(),
        decimals: decoded[3]._isBigNumber && decoded[3].toNumber(),
        timestamp: decoded[4]._isBigNumber && decoded[4].toNumber(),
      }
    } catch (error2) {
      console.error("Decoding failed for both structures:", error1, error2);
    }
  }

  return {};
}
