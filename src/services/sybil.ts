import sybilCanister from 'Canisters/sybilCanister';
import { AddressData, GeneralResponse } from 'Interfaces/common';
import { remove0x } from 'Utils/addressUtils';
import logger from 'Utils/logger';

// useQuery + sybil request + toastify

export const generateApiKey = async (addressData: AddressData) => {
  // @ts-ignore
  const res: GeneralResponse = await sybilCanister.get_api_key(addressData.message, remove0x(addressData.signature));

  if (res.Err) {
    logger.error(`Failed to generate api key, ${res.Err}`);
    throw new Error(`Failed to generate api key, ${res.Err}`);
  }

  return res.Ok;
};
