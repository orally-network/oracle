import { Column } from 'Components/Table.tsx';
import {
  useFetchApiKeys,
  useDeleteApiKey,
  useGenerateApiKey
} from 'Services/sybilService';

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
      />
    </>
  )
};
