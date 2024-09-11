const lisbonData = {
  timeZone: 'Europe/Lisbon',
  title: 'Lisbon',
  name: 'lisbon',
  lat: '38.736946',
  lon: '-9.142685',
  version: 'v2',
  closeAuctionSubscriptionId: null,
  provideTemperatureSubscriptionId: null,
  contract: {
    // arbitrum
    42161: '0x5Dbac3C004167c895aCF24B08E5C28EEa700696b',
  },
};

export const predictionsMap = {
  lisbon: lisbonData,
  lisbonV1: {
    ...lisbonData,
    contract: {
      // arbitrum
      42161: '0x8B2B8E6e8bF338e6071E6Def286B8518B7BFF7F1',
    },
    version: 'v1',
    closeAuctionSubscriptionId: 57,
    provideTemperatureSubscriptionId: 59,
  },
  denver: {
    timeZone: 'America/Denver',
    title: 'Denver',
    name: 'denver',
    lat: '39.742043',
    lon: '-104.991531',
    version: 'v2',
    closeAuctionSubscriptionId: 60,
    provideTemperatureSubscriptionId: 61,
    contract: {
      // arbitrum
      42161: '0xEb5d337c33f52E571fEB28b005C0b0B332D21028',
    },
  },
};

export const predictions = Object.values(predictionsMap);

export default predictions;
