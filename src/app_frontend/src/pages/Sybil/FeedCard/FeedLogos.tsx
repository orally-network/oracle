import React from 'react';
import styles from './FeedCard.scss';

interface FeedLogosProps {
  pair: string;
}

export const FeedLogos = ({ pair }: FeedLogosProps) => {
  const [firstCoin, secondCoin] = pair.split('/');

  return (
    <div className={styles.feedLogos}>
      <div className={styles.logoWrap}>
        <img src={`/coins/${firstCoin.toLowerCase()}.svg`} alt={`${firstCoin} logo`} />
      </div>
      <div className={styles.logoWrap} style={{ marginLeft: '-15px' }}>
        <img src={`/coins/${secondCoin.toLowerCase()}.svg`} alt={`${secondCoin} logo`} />
      </div>
    </div>
  );
};
