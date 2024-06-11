import { useState } from 'react';

interface FeedLogosProps {
  feed: string;
  size?: number;
}

export const FeedLogos = ({ feed, size = 46 }: FeedLogosProps) => {
  const [firstCoin, secondCoin = ''] = feed.split('/');
  const [isPlaceholder, setIsPlaceholder] = useState(false);

  return (
    <div className="flex justify-center items-center">
      {isPlaceholder ? (
        <img
          src="/assets/placeholder.png"
          alt="placeholder"
          style={{
            maxWidth: size === 46 ? '35px' : '50px',
            backgroundColor: '#1890FF',
          }}
        />
      ) : (
        <>
          <div
            className="flex border-solid rounded-full border-background"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderWidth: size === 46 ? '4px' : '13px',
            }}
          >
            <img
              src={`/assets/coins/${firstCoin.toLowerCase()}.svg`}
              alt={`${firstCoin} logo`}
              style={{
                maxWidth: size === 46 ? '35px' : '50px',
              }}
              onError={(e: any) => {
                e.target.onerror = null;
                setIsPlaceholder(true);
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
          <div
            className="flex border-solid rounded-full border-background"
            style={{
              marginLeft: size === 46 ? '-15px' : '-25px',
              width: `${size}px`,
              height: `${size}px`,
              borderWidth: size === 46 ? '4px' : '13px',
            }}
          >
            <img
              src={`/assets/coins/${secondCoin.toLowerCase()}.svg`}
              alt={`${secondCoin} logo`}
              style={{
                maxWidth: size === 46 ? '35px' : '50px',
              }}
              onError={(e: any) => {
                e.target.onerror = null;
                setIsPlaceholder(true);
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
