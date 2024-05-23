import { useCallback, useState } from 'react';
import { Chip, Tooltip, User } from '@nextui-org/react';

import { Table } from 'Components/Table';
import { DeleteIcon } from 'SVGICons/DeleteIcon';
import { Modal, useModal } from 'Components/Modal';

const columns = [
  {
    key: 'apiKey',
    label: 'API Key',
  },
  {
    key: 'requests',
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

const mock_rows = [
  {
    key: 1,
    apiKey: '8cb0484843cb524acac128d14830e6e7',
    requests: 1_000,
    spent: 10.245,
    limit: 100_000,
  },
  {
    key: 2,
    apiKey: '8cb0484843cb524acac128d14830e6e7',
    requests: 1_000,
    spent: 10.245,
    limit: 100_000,
  },
  {
    key: 3,
    apiKey: '8cb0484843cb524acac128d14830e6e7',
    requests: 1_000,
    spent: 10.245,
    limit: 100_000,
  },
  {
    key: 4,
    apiKey: '8cb0484843cb524acac128d14830e6e7',
    requests: 1_000,
    spent: 10.245,
    limit: 100_000,
  },
  {
    key: 5,
    apiKey: '8cb0484843cb524acac128d14830e6e7',
    requests: 1_000,
    spent: 10.245,
    limit: 100_000,
  },
];

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

export const KeysTable = () => {
  const { isOpen, onOpenChange, onOpen } = useModal();

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    console.log({ isOpen });

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case 'role':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
          </div>
        );
      case 'status':
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case 'actions':
        return (
          <div className="relative flex items-center gap-2">
            <span onClick={onOpen} className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon/>
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, [isOpen, onOpen, onOpenChange]);

  return (
    <>
      <Table
        ariaLabel="API Keys"
        columns={columns}
        rows={mock_rows}
        renderCell={renderCell}
      />

      <Modal
        title="Are you sure?"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        actions={[
          {
            label: 'Delete',
            onPress: () => {},
            variant: 'danger',
          },
        ]}
      >
        <div>You will not be able to recover this key.</div>
      </Modal>
    </>
  )
};
