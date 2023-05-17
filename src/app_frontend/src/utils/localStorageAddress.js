import { add0x } from 'Utils/addressUtils';

const localStorageAddressKey = 'address';

export const setLocalStorageAddress = (address, message, signature, executionAddress, keyPrefix = '') => {
  const addressData = {
    address,
    message,
    signature,
    executionAddress: add0x(executionAddress),
  };

  localStorage.setItem(`${keyPrefix}${localStorageAddressKey}`, JSON.stringify({
    [address]: addressData,
  }));

  return addressData;
};

export const getLocalStorageAddress = (address, keyPrefix = '') => {
  return JSON.parse(localStorage.getItem(`${keyPrefix}${localStorageAddressKey}`))?.[address];
}
