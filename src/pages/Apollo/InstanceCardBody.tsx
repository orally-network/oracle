import { useMemo } from 'react';

import { EVENT_NAME_DATA_FEED_REQUESTED, EVENT_NAME_RANDOM_FEED_REQUESTED } from 'Services/apolloService';
import { FeedLogos } from 'Components/FeedLogos';

interface InstanceCardBodyProps {
  parsedLog: any,
}

const getLogLabel = (parsedLog: any) => {
  switch (parsedLog.name) {
    case EVENT_NAME_RANDOM_FEED_REQUESTED:
      return 'Random';
    case EVENT_NAME_DATA_FEED_REQUESTED:
      return <FeedLogos feed={parsedLog.args.dataFeedId}/>;
    default:
      return '';
  }
};

export const InstanceCardBody = ({ parsedLog }: InstanceCardBodyProps) => {
  console.log({ parsedLog }, Number(parsedLog?.args?.requestId?.toNumber()));

  const requestId = useMemo(() => {
    return parsedLog.args.requestId.toNumber();
  }, [parsedLog]);

  return (
    <div className="bg-background w-full flex items-center justify-around">
      <div className="flex items-center justify-center text-lg">
        {getLogLabel(parsedLog)}
      </div>

      <div className="flex flex-col">
        <div>
          Data provided
        </div>

        <div className="flex justify-center">
          Request id: {requestId}
        </div>
      </div>
    </div>
  );
};
