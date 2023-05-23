import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from 'antd';
import cn from 'classnames';
import { CopyBlock, atomOneLight } from 'react-code-blocks';
import { Spin } from 'antd';

import config from 'Constants/config';
import { useSybilPairs } from 'Providers/SybilPairs';

import styles from './Feeds.scss';

const MILLI = Math.pow(10, 3);

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
      "timestamp": ${selectedFeed?.data?.timestamp ?? 'number'}, // ${new Date(Number(selectedFeed?.data?.timestamp) * MILLI).toGMTString()}
      "decimals": ${selectedFeed?.data?.decimals ?? 'number'}
    },
    "signature": string
  }
  `;
}

const Feeds = () => {
  const { pairs, isLoading } = useSybilPairs();
  const [selectedFeed, setSelectedFeed] = useState(null);
  
  useEffect(() => {
    if (pairs.length > 0) {
      setSelectedFeed(pairs[0]);
    }
  }, [pairs]);
  
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
          {pairs.map((feed) => (
            <Card
              className={cn([styles.feed, feed.id === selectedFeed?.id && styles.selected])}
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
