import { useCallback, useMemo } from 'react';

import { Column } from 'Components/Table';
import {
  useFetchApiKeys,
  useDeleteApiKey,
  useGenerateApiKey
} from 'Services/sybilService';
import { useApiKeyStore } from 'Stores/useApiKeyStore';

import { SybilTable } from './SybilTable';

const additionalColumns: Column[] = [
  {
    label: 'API Key',
    key: 'apiKey',
  },
];

export const KeysTable = () => {
  const { data: apiKeys, isLoading } = useFetchApiKeys();
  const { mutate: deleteApiKey } = useDeleteApiKey();
  const { mutate: generateApiKey, isPending } = useGenerateApiKey();

  const selectedApiKey = useApiKeyStore.use.selectedApiKey();
  const updateSelectedApiKey = useApiKeyStore.use.updateSelectedApiKey();

  const handleSelectionChange = useCallback((e: any) => {
    const item = (apiKeys ?? []).find((apiKey) => apiKey.key == [...e][0]);

    if (item) {
      updateSelectedApiKey(item.apiKey);
    }
  }, [apiKeys]);

  const selectedKeys = useMemo(() => {
    return selectedApiKey ? [selectedApiKey] : [];
  }, [selectedApiKey]);

  return (
    <>
      <SybilTable
        items={apiKeys ?? []}
        add={generateApiKey}
        remove={deleteApiKey}
        isLoading={isLoading}
        isAdding={isPending}
        addLabel="Generate API Key"
        title="API Keys allow you to access the Sybil API."
        additionalColumns={additionalColumns}

        onSelectionChange={handleSelectionChange}
        selectionMode="single"
        selectedKeys={selectedKeys}
      />
    </>
  )
};
