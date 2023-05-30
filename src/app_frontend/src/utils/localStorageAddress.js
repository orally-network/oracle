import { add0x } from 'Utils/addressUtils';

const localStorageAddressKey = 'address';

export const setLocalStorageAddress = (address, message, signature, executionAddress) => {
  const addressData = {
    address,
    message,
    signature,
    executionAddress: add0x(executionAddress),
  };
  
  const currentLocalStorageAddress = getLocalStorageAddress(address);

  localStorage.setItem(localStorageAddressKey, JSON.stringify({
    ...currentLocalStorageAddress,
    [address]: addressData,
  }));

  return addressData;
};

export const getLocalStorageAddress = (address, keyPrefix = '') => {
  return JSON.parse(localStorage.getItem(localStorageAddressKey))?.[address];
}
