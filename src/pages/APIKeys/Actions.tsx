import { Button } from '@nextui-org/react';

import { useGlobalState } from 'Providers/GlobalState';
import { SignInButton } from 'Shared/SignInButton';
import { SybilTopUp } from 'Shared/SybilTopUp';
import { useGenerateApiKey } from 'Services/sybilService';

export const Actions = () => {
  const { addressData } = useGlobalState();

  const { mutate: generateApiKey, isLoading } = useGenerateApiKey();

  return (
    <div className="flex justify-between gap-2">
      {addressData && addressData.signature ? (
        <>
          <SybilTopUp />

          <Button
            color="primary"
            onClick={generateApiKey as any}
            isLoading={isLoading}
          >
            Generate API Key
          </Button>
        </>
      ) : (
        <SignInButton style={{ alignSelf: 'flex-end' }}/>
      )}
    </div>
  );
};
