import React from 'react';
import styles from './Logos.scss';

type LogosProps = {
  feed: string;
  size?: number;
};

export const Logos = ({ feed, size = 46 }: LogosProps) => {
  const [firstCoin, secondCoin = ''] = feed.split('/');
  const [isPlaceholder, setIsPlaceholder] = React.useState(false);

  return (
    <div className={styles.feedLogos}>
      {isPlaceholder ? (
        <img
          src="/placeholder.png"
          alt="placeholder"
          style={{
            maxWidth: size === 46 ? '35px' : '50px',
            backgroundColor: '#1890FF',
          }}
        />
      ) : (
        <>
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
              onError={(e: any) => {
                e.target.onerror = null;
                setIsPlaceholder(true);
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
              onError={(e: any) => {
                e.target.onerror = null;
                setIsPlaceholder(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
