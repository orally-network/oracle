import React from 'react';
import styles from './FeedCard.scss';

interface FeedLogosProps {
  feed: string;
  size?: number;
}

export const FeedLogos = ({ feed, size = 46 }: FeedLogosProps) => {
  const [firstCoin, secondCoin] = feed.split('/');

  return (
    <div className={styles.feedLogos}>
      <div
        className={styles.logoWrap}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: size === 46 ? '4px' : '13px',
        }}
      >
        <img
          src={`/coins/${firstCoin.toLowerCase()}.svg`}
          alt={`${firstCoin} logo`}
          style={{
            maxWidth: size === 46 ? '35px' : '50px',
          }}
        />
      </div>
      <div
        className={styles.logoWrap}
        style={{
          marginLeft: size === 46 ? '-15px' : '-25px',
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: size === 46 ? '4px' : '13px',
        }}
      >
        <img
          src={`/coins/${secondCoin.toLowerCase()}.svg`}
          alt={`${secondCoin} logo`}
          style={{
            maxWidth: size === 46 ? '35px' : '50px',
          }}
        />
      </div>
    </div>
  );
};
