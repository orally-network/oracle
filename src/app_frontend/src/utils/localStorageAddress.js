import { add0x } from 'Utils/addressUtils';

const localStorageAddressKey = 'address';

export const setLocalStorageAddress = (address, message, signature, executionAddress) => {
  const addressData = {
    address: add0x(address),
    message,
    signature,
    executionAddress: add0x(executionAddress),
  };

  localStorage.setItem(localStorageAddressKey, JSON.stringify({
    [add0x(address)]: addressData,
  }));

  return addressData;
};

export const getLocalStorageAddress = (address) => {
  return JSON.parse(localStorage.getItem(localStorageAddressKey))?.[address];
}
