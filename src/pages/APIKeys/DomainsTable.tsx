import { useCallback, useMemo, useState } from 'react';
import { Input } from '@nextui-org/react';

import { Modal, useModal } from 'Components/Modal.tsx';
import { type Column } from 'Components/Table';
import { useBanDomain, useFetchAllowedDomains, useGrantDomain } from 'Services/sybilService';

import { SybilTable } from './SybilTable';

const additionalColumns: Column[] = [
  {
    label: 'Domain',
    key: 'domain',
  },
];

export const DomainsTable = () => {
  const [newDomain, setNewDomain] = useState<string>('');

  const { isOpen, onOpenChange, onOpen, onClose } = useModal();

  const { data: allowedDomains, isLoading } = useFetchAllowedDomains();
  const { mutate: grantDomain, isPending } = useGrantDomain();
  const { mutate: banDomain } = useBanDomain();

  const grantAction = useMemo(
    () => [
      {
        label: 'Grant',
        onPress: () => {
          grantDomain(newDomain);
          setNewDomain('');
          onClose();
        },
      },
    ],
    [newDomain],
  );

  return (
    <>
      <SybilTable
        items={allowedDomains ?? []}
        add={onOpen}
        remove={banDomain}
        isLoading={isLoading}
        isAdding={isPending}
        addLabel="Grant Domain"
        title="Domains granted to access Sybil API."
        additionalColumns={additionalColumns}
      />

      <Modal
        title="Grant permission to domain"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        actions={grantAction}
      >
        <Input
          label="Domain"
          variant="bordered"
          value={newDomain}
          onChange={useCallback((e: any) => setNewDomain(e.target.value), [])}
        />
      </Modal>
    </>
  );
};
