import { Spinner } from '@nextui-org/react';
import { useMemo } from 'react';

import { EVENT_NAME_DATA_FEED_REQUESTED, EVENT_NAME_RANDOM_FEED_REQUESTED } from 'ABIs/constants';
import { FeedLogos } from 'Components/FeedLogos';
import { ApolloInstance } from 'Services/apolloService';
import { useGetApolloCoordinatorLogs, useGetMulticallLogs } from 'Services/wagmiService.ts';

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

  console.log({ lastCoordinatorLog, lastMulticallLog })

  if (isCoordinatorLogsLoading) {
    return <Spinner className="p-4"/>;
  }

  if (!lastCoordinatorLog) {
    return (
      <div className="bg-background items-center justify-center text-center text-lg">
        None
      </div>
    );
  }

  return (
    <div className="bg-background w-full flex items-center justify-around">
      <div className="flex items-center justify-center text-lg">
        {getLogLabel(lastCoordinatorLog)}
      </div>

      <div className="flex flex-col">
        <div>
          {isMulticallLogsLoading ? (
            <Spinner className="p-4"/>
          ) : (
            <div>
              Requested data
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
