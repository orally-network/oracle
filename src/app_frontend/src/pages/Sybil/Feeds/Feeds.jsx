import React, { useState, useCallback, useMemo } from 'react';
import { Card } from 'antd';
import cn from 'classnames';
import { CopyBlock, atomOneLight } from 'react-code-blocks';

import config from 'Constants/config';

import styles from './Feeds.scss';

const MOCK_FEEDS = [
  {
    pair_id: 'BTC/USD',
  },
  {
    pair_id: 'ETH/USD',
  },
  {
    pair_id: 'ICP/USD',
  },
]

// todo: integrate with Sybil and show real data from pairs
const getCodeText = (selectedFeed) => {
  const url = `http${config.isDevelopment ? '' : 's'}://${config.sybil_canister_id}.${config.DOMAIN}/get_asset_data_with_proof?pair_id=${selectedFeed}`;
  
  return `// fetch price feed
  const url = '${url}';
  const response = await fetch(url);
  
  // response example:
  {
    "data": {
      "symbol": string,
      "rate": number,
      "timestamp": number,
      "decimals": number
    }
    "signature": string
  }
  `;
}

const Feeds = () => {
  const [feeds, setFeeds] = useState(MOCK_FEEDS);
  const [selectedFeed, setSelectedFeed] = useState(MOCK_FEEDS[0]);
  
  const codeText = useMemo(() => {
    // return `${config.HOST}/get_asset_data_with_proof?pair_id=${selectedFeed}`
    
    return getCodeText(selectedFeed);
  }, [selectedFeed]);
  
  const handleFeedClick = useCallback((ev) => {
    setSelectedFeed(ev.target.innerText);
  }, []);
  
  return (
    <div className={styles.feedsWrapper}>
      <div className={styles.feeds}>
        {feeds.map((feed) => (
          <Card
            className={cn([styles.feed, feed.pair_id === selectedFeed && styles.selected])}
            key={feed.pair_id}
            onClick={handleFeedClick}
          >
            {feed.pair_id}
          </Card>
        ))}
      </div>

      <div className={styles.feedDetails}>
        <CopyBlock
          text={codeText}
          language={'typescript'}
          // showLineNumbers={showLineNumbers}
          // startingLineNumber={startingLineNumber}
          theme={atomOneLight}
          codeBlock
        />
      </div>
    </div>
  )
};

export default Feeds;
