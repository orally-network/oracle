import { Spinner, Tooltip } from '@nextui-org/react';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

import { EVENT_NAME_DATA_FEED_REQUESTED, EVENT_NAME_RANDOM_FEED_REQUESTED } from 'ABIs/constants';
import { FeedLogos } from 'Components/FeedLogos';
import { ApolloInstance } from 'Services/apolloService';
import { useGetApolloCoordinatorLogs, useGetMulticallLogs } from 'Services/wagmiService';
import { truncateNumberSymbols } from 'Utils/addressUtils';

interface InstanceCardBodyProps {
  instance: ApolloInstance,
}

const getLogLabel = (parsedLog: any) => {
  switch (parsedLog.name) {
    case EVENT_NAME_RANDOM_FEED_REQUESTED:
      return 'Random';
    case EVENT_NAME_DATA_FEED_REQUESTED:
      return <FeedLogos feed={parsedLog.dataFeedId}/>;
    default:
      return '';
  }
};

const getRequestedData = (requestLogName: string, requestedData: any) => {
  switch (requestLogName) {
    case EVENT_NAME_RANDOM_FEED_REQUESTED:
      return (
        <Tooltip content={requestedData.randomWords.join(', ')}>
          {truncateNumberSymbols(requestedData.randomWords[0], 4)}
        </Tooltip>
      );
    case EVENT_NAME_DATA_FEED_REQUESTED:
      return '$' + Number(formatUnits(requestedData.rate, requestedData.decimals)).toFixed(4);
    default:
      return '';
  }
}

export const InstanceCardBody = ({ instance }: InstanceCardBodyProps) => {
  const { data: parsedLogs, isLoading: isCoordinatorLogsLoading } = useGetApolloCoordinatorLogs(
    instance.chainId,
    instance.apolloCoordinator,
  );

  const { data: multicallLogs, isLoading: isMulticallLogsLoading } = useGetMulticallLogs(
    instance.chainId,
    instance.evmAddress,
  );

  const lastCoordinatorLog = useMemo(() => parsedLogs?.[parsedLogs?.length - 1], [parsedLogs]);
  const lastMulticallLog = useMemo(() => multicallLogs?.[multicallLogs?.length - 1], [multicallLogs]);

  if (isCoordinatorLogsLoading) {
    return <Spinner className="p-4"/>;
  }

  if (!lastCoordinatorLog) {
    return (
      <div className="flex bg-background items-center justify-center text-center text-lg h-20">
        None
      </div>
    );
  }

  const requestedData = lastMulticallLog?.callsData?.find((callData: any) => callData.requestId === lastCoordinatorLog.requestId);

  return (
    <div className="bg-background w-full flex items-center justify-around h-20">
      <div className="flex items-center justify-center text-lg">
        {getLogLabel(lastCoordinatorLog)}
      </div>

      <div className="flex flex-col">
        <div>
          {isMulticallLogsLoading || !requestedData ? (
            <Spinner className="flex justify-center p-4"/>
          ) : (
            <div className="flex justify-center text-lg">
              {getRequestedData(lastCoordinatorLog.name, requestedData)}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          Request id: {lastCoordinatorLog.requestId}
        </div>
      </div>
    </div>
  );
};
