import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from 'antd';
import cn from 'classnames';
import { CopyBlock, atomOneLight } from 'react-code-blocks';
import { Spin } from 'antd';

import config from 'Constants/config';

import sybilCanister from '../sybilCanister'

import styles from './Feeds.scss';

const NANO_MILLI_DIFFERENCE = Math.pow(10, 6);

const getCodeText = (selectedFeed) => {
  const url = `http${config.isDevelopment ? '' : 's'}://${config.sybil_canister_id}.${config.DOMAIN}/get_asset_data_with_proof?pair_id=${selectedFeed?.id ?? '{pair_id}'}`;
  
  return `// fetch price feed
  const url = '${url}';
  const response = await fetch(url);
  
  // response example:
  {
    "data": {
      "symbol": "${selectedFeed?.id ?? 'string'}",
      "rate": ${selectedFeed?.data?.rate ?? 'number'},
      "timestamp": ${selectedFeed?.data?.timestamp ?? 'number'}, // ${new Date(Number(selectedFeed?.data?.timestamp) / NANO_MILLI_DIFFERENCE).toGMTString()}
      "decimals": ${selectedFeed?.data?.decimals ?? 'number'}
    },
    "signature": string
  }
  `;
}

const Feeds = () => {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPairs = async () => {
      const pairs = await sybilCanister.get_pairs();
      
      console.log({ pairs });
      setFeeds(pairs);
      setSelectedFeed(pairs[0]);
      setIsLoading(false);
    };
    
    fetchPairs();
  }, []);
  
  const codeText = useMemo(() => {
    return getCodeText(selectedFeed);
  }, [selectedFeed]);
  
  const handleFeedClick = useCallback((feed) => {
    setSelectedFeed(feed);
  }, []);
  
  return (
    <div className={styles.feedsWrapper}>
      <Spin spinning={isLoading}>
        <div className={styles.feeds}>
          {feeds.map((feed) => (
            <Card
              className={cn([styles.feed, feed.id === selectedFeed.id && styles.selected])}
              key={feed.id}
              onClick={handleFeedClick.bind(null, feed)}
            >
              {feed.id}
            </Card>
          ))}
        </div>
      </Spin>

      <Spin spinning={isLoading}>
        <div className={styles.feedDetails}>
          <CopyBlock
            text={codeText}
            language={'typescript'}
            theme={atomOneLight}
            codeBlock
          />
        </div>
      </Spin>
    </div>
  )
};

export default Feeds;
