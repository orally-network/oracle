import { useCallback, useMemo, useState } from 'react';

import { Table } from 'Components/Table';
import { DeleteIcon } from 'SVGICons/DeleteIcon';
import { Modal, useModal } from 'Components/Modal';
import { useFetchApiKeys, type ApiKey, useFetchBaseFee, useDeleteApiKey } from 'Services/sybilService';

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

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

export const KeysTable = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const { isOpen, onOpenChange, onOpen, onClose } = useModal();

  const { data: baseFee, isLoading: isFeeLoading } = useFetchBaseFee();
  const { data: apiKeys, isLoading } = useFetchApiKeys();
  const { mutate: deleteApiKey } = useDeleteApiKey();

  const renderCell = useCallback((apiKey: ApiKey, columnKey: string) => {
    const cellValue = apiKey[columnKey];

    switch (columnKey) {
      case 'spent':
        return apiKey.requestCount ? apiKey.requestCount * Number(baseFee) : 0;
      // case 'status':
      //   return (
      //     <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
      //       {cellValue}
      //     </Chip>
      //   );
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
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

  return (
    <>
      <Table
        ariaLabel="API Keys"
        columns={columns}
        rows={apiKeys ?? []}
        renderCell={renderCell}
        isLoading={isLoading || isFeeLoading}
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
