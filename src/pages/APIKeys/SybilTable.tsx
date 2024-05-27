import { useGlobalState } from 'Providers/GlobalState';
import { useCallback, useMemo, useState } from 'react';
import { Button, Progress, Tooltip } from '@nextui-org/react';
import { formatUnits } from 'viem';

import { Table, type Column } from 'Components/Table';
import { DeleteIcon } from 'SVGICons/DeleteIcon';
import { Modal, useModal } from 'Components/Modal';
import {
  type ApiKey,
  useFetchBaseFee,
} from 'Services/sybilService';
import { BALANCE_USD_DECIMALS } from 'Utils/balance';

const columns: Column[] = [
  {
    key: 'apiKey',
    label: 'API Key',
  },
  {
    key: 'requestCount',
    label: 'Requests',
  },
  {
    key: 'spent',
    label: 'Spent',
  },
  {
    key: 'limit',
    label: 'Limit',
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'center',
  },
];

interface SybilTableProps {
  items: any[];
  add: () => void;
  remove: (key: string) => void;
  isLoading: boolean;
  isAdding: boolean;
  addLabel: string;
  title: string,
  additionalColumns?: Column[],
}

export const SybilTable = ({ items, add, remove, isLoading, isAdding, addLabel, title, additionalColumns }: SybilTableProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const { isOpen, onOpenChange, onOpen, onClose } = useModal();

  const { addressData } = useGlobalState();

  const { data: baseFee, isLoading: isFeeLoading } = useFetchBaseFee();

  const renderCell = useCallback((apiKey: ApiKey, columnKey: string) => {
    const cellValue = apiKey[columnKey];

    switch (columnKey) {
      case 'spent':
        return apiKey.requestCount && baseFee ? `$${formatUnits(BigInt(apiKey.requestCount) * baseFee, BALANCE_USD_DECIMALS)}` : 0;
      case 'limit':
        return (
          <Tooltip content={`${apiKey.requestCount}/${apiKey.requestLimit}`}>
            <Progress aria-label="Loading..." value={apiKey.requestCount} maxValue={apiKey.requestLimit} />
          </Tooltip>
        );
      case 'actions':
        return (
          <div className="flex items-center text-center">
            <span
              onClick={() => {
                setSelectedKey(apiKey.apiKey ?? apiKey.domain);
                onOpen();
              }}
              className="text-lg text-danger cursor-pointer active:opacity-50"
            >
              <DeleteIcon/>
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, [onOpen, baseFee]);

  const deleteAction = useMemo(() => [
    {
      label: 'Delete',
      onPress: () => {
        if (selectedKey) {
          remove(selectedKey);
          setSelectedKey(null);
          onClose();
        }
      },
      variant: 'danger',
    },
  ], [selectedKey]);

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between">
        <p className="text-lg">{title}</p>

        <Button
          className="min-w-36"
          color="primary"
          onClick={add as any}
          isLoading={isAdding}
          isDisabled={!addressData.signature}
        >
          {addLabel}
        </Button>
      </div>
    )
  }, [addressData.signature, isAdding, addLabel, title]);

  return (
    <>
      <Table
        ariaLabel="API Keys"
        columns={additionalColumns ? [...additionalColumns, ...columns] : columns}
        rows={isFeeLoading || !items ? [] : items}
        renderCell={renderCell}
        isLoading={isLoading || isFeeLoading}
        topContent={topContent}
      />

      <Modal
        title="Are you sure?"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        // @ts-ignore
        actions={deleteAction}
      >
        <div>You will not be able to recover this key.</div>
      </Modal>
    </>
  )
};
