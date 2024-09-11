import { Tooltip } from '@nextui-org/react';
import { useCallback, useMemo } from 'react';
import { formatUnits } from 'viem';

import { Column, Table } from 'Components/Table';
import { useGetApolloCoordinatorLogs, useGetMulticallLogs } from 'Services/wagmiService';
import { type ApolloInstance } from 'Services/apolloService';
import { truncateNumberSymbols } from 'Utils/addressUtils';
import { EVENT_NAME_DATA_FEED_REQUESTED, EVENT_NAME_RANDOM_FEED_REQUESTED } from 'ABIs/constants';
import { AddressSnippet } from 'Components/AddressSnippet';

const columns: Column[] = [
  {
    key: 'requestId',
    label: 'Request Id',
  },
  {
    key: 'dataFeedId',
    label: 'Data Feed',
  },
  {
    key: 'value',
    label: 'Value',
  },
  {
    key: 'requester',
    label: 'Requester',
  },
  {
    key: 'target',
    label: 'Target',
  },
  {
    key: 'name',
    label: 'Log Name',
  },
  {
    key: 'requestedBlockNumber',
    label: '#Requested Block',
  },
  {
    key: 'fulfilledBlockNumber',
    label: '#Fulfilled Block',
  },
];

interface LogsTableProps {
  instance: ApolloInstance;
}

export const LogsTable = ({ instance }: LogsTableProps) => {
  const { data: coordinatorLogs, isLoading: isCoordinatorLogsLoading } =
    useGetApolloCoordinatorLogs(instance.chainId, instance.apolloCoordinator);

  const { data: multicallLogs, isLoading: isMulticallLogsLoading } = useGetMulticallLogs(
    instance.chainId,
    instance.evmAddress,
  );

  const items = useMemo(() => {
    if (!coordinatorLogs || !multicallLogs) return [];

    // make merge between coordinatorLogs and multicallLogs by requestId
    return coordinatorLogs
      ?.map((coordinatorLog) => {
        const requestedData = multicallLogs?.find((multicallLog) =>
          multicallLog?.callsData?.find(
            (callData: any) => callData.requestId === coordinatorLog.requestId,
          ),
        );

        if (!requestedData) return;

        return {
          key: coordinatorLog.requestId,
          ...requestedData,
          ...requestedData?.callsData?.[0],
          ...coordinatorLog,
        };
      })
      .filter(Boolean);
  }, [coordinatorLogs, multicallLogs]);

  const renderCell = useCallback((item: any, columnKey: string) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case 'requester':
      case 'target':
        return <AddressSnippet address={cellValue} />;
      case 'value':
        if (item.name === EVENT_NAME_DATA_FEED_REQUESTED) {
          return `$${Number(formatUnits(item.rate, item.decimals)).toFixed(4)}`;
        } else if (item.name === EVENT_NAME_RANDOM_FEED_REQUESTED) {
          return (
            <Tooltip content={item.randomWords.join(', ')}>
              {truncateNumberSymbols(item.randomWords[0], 4)}
            </Tooltip>
          );
        }
        break;
      case 'dataFeedId':
        return cellValue ?? 'Random';
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      ariaLabel="LogsTable"
      columns={columns}
      rows={items}
      renderCell={renderCell}
      isLoading={isCoordinatorLogsLoading || isMulticallLogsLoading}
    />
  );
};
