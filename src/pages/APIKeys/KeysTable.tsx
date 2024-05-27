import { useGlobalState } from 'Providers/GlobalState';
import { useCallback, useMemo, useState } from 'react';
import { Button, Progress, Tooltip } from '@nextui-org/react';
import { formatUnits } from 'viem';

import { Table } from 'Components/Table';
import { DeleteIcon } from 'SVGICons/DeleteIcon';
import { Modal, useModal } from 'Components/Modal';
import {
  useFetchApiKeys,
  type ApiKey,
  useFetchBaseFee,
  useDeleteApiKey,
  useGenerateApiKey
} from 'Services/sybilService';
import { BALANCE_USD_DECIMALS } from 'Utils/balance';

const columns = [
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
  },
];

export const KeysTable = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const { isOpen, onOpenChange, onOpen, onClose } = useModal();

  const { addressData } = useGlobalState();

  const { data: baseFee, isLoading: isFeeLoading } = useFetchBaseFee();
  const { data: apiKeys, isLoading } = useFetchApiKeys();
  const { mutate: deleteApiKey } = useDeleteApiKey();
  const { mutate: generateApiKey, isPending } = useGenerateApiKey();

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
                setSelectedKey(apiKey.apiKey);
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
          deleteApiKey({ apiKey: selectedKey });
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
        <p className="text-lg">API Keys allow you to access the Sybil API.</p>

        <Button
          color="primary"
          onClick={generateApiKey as any}
          isLoading={isPending}
          isDisabled={!addressData.signature}
        >
          Generate API Key
        </Button>
      </div>
    )
  }, [addressData.signature, isPending, generateApiKey]);

  return (
    <>
      <Table
        ariaLabel="API Keys"
        columns={columns}
        rows={isFeeLoading || !apiKeys ? [] : apiKeys}
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
