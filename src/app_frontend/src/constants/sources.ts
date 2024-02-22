import React from 'react';

import coinbaseIcon from 'Assets/exchanges/coinbase.svg';
import kucoinIcon from 'Assets/exchanges/kucoin.svg';
import okxIcon from 'Assets/exchanges/okx.svg';
import gateioIcon from 'Assets/exchanges/gateio.svg';
import mexcIcon from 'Assets/exchanges/mexc.svg';
import cryptocomIcon from 'Assets/exchanges/cryptocom.png';
import poloniexIcon from 'Assets/exchanges/poloniex.png';
import bitgetIcon from 'Assets/exchanges/bitget.svg';
import digifinexIcon from 'Assets/exchanges/digifinex.svg';

type ExchangeSource = {
  name: string;
  url: string;
  logo: React.FunctionComponent<React.SVGAttributes<SVGElement>> | string;
};

export const exchangeURLS: ExchangeSource[] = [
  {
    name: 'Coinbase',
    url: 'https://api.pro.coinbase.com/products/BASE_ASSET-QUOTE_ASSET/candles?granularity=60&start=START_TIME&end=END_TIME',
    logo: coinbaseIcon,
  },
  {
    name: 'Kucoin',
    url: 'https://api.kucoin.com/api/v1/market/candles?symbol=BASE_ASSET-QUOTE_ASSET&type=1min&startAt=START_TIME&endAt=END_TIME',
    logo: kucoinIcon,
  },
  {
    name: 'Okx',
    url: 'https://www.okx.com/api/v5/market/history-candles?instId=BASE_ASSET-QUOTE_ASSET&bar=1m&before=START_TIME&after=END_TIME',
    logo: okxIcon,
  },
  {
    name: 'Gateio',
    url: 'https://api.gateio.ws/api/v4/spot/candlesticks?currency_pair=BASE_ASSET_QUOTE_ASSET&interval=1m&from=START_TIME&to=END_TIME',
    logo: gateioIcon,
  },
  {
    name: 'Mexc',
    url: 'https://www.mexc.com/open/api/v2/market/kline?symbol=BASE_ASSET_QUOTE_ASSET&interval=1m&start_time=START_TIME&limit=1',
    logo: mexcIcon,
  },
  {
    name: 'Poloniex',
    url: 'https://api.poloniex.com/markets/BASE_ASSET_QUOTE_ASSET/candles?interval=MINUTE_1&startTime=START_TIME&endTime=END_TIME',
    logo: poloniexIcon,
  },
  {
    name: 'Cryptocom',
    url: 'https://api.crypto.com/exchange/v1/public/get-candlestick?instrument_name=BASE_ASSET_QUOTE_ASSET&timeframe=1m&start_ts=START_TIME&count=1',
    logo: cryptocomIcon,
  },
  {
    name: 'Bitget',
    url: 'https://api.bitget.com/api/v2/spot/market/candles?symbol=BASE_ASSETQUOTE_ASSET&granularity=1min&startTime=START_TIME&endTime=END_TIME',
    logo: bitgetIcon,
  },
  {
    name: 'Digifinex',
    url: 'https://openapi.digifinex.com/v3/kline?symbol=BASE_ASSET_QUOTE_ASSET&period=1&start_time=START_TIME&end_time=END_TIME',
    logo: digifinexIcon,
  },
];
