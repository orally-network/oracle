import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/react';

import { useGlobalState } from 'Providers/GlobalState';
import { toast } from 'react-toastify';
import { SignInButton } from 'Shared/SignInButton';
import { SybilTopUp } from 'Shared/SybilTopUp';
import { generateApiKey } from 'Stores/useSybilBalanceStore';
import logger from 'Utils/logger.js';

export const Actions = () => {
  const { addressData } = useGlobalState();

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateApiKey = useCallback(async () => {
    setIsGenerating(true);

    const res = await toast.promise(generateApiKey(addressData), {
      pending: `Generating API Key`,
      success: {
        render({ data }) {
          return `Generated successfully: ${data}`;
        },
      },
      error: {
        render({ data }) {
          setIsGenerating(false);
          logger.error(`Generating api key`, data);

          return 'Generation failed. Try again later.';
        },
      },
    });

    setIsGenerating(false);
    console.log({ res });
  }, [addressData]);

  return (
    <div className="flex justify-between gap-2">
      {addressData && addressData.signature ? (
        <>
          <SybilTopUp />

          <Button
            color="primary"
            onClick={handleGenerateApiKey}
            isLoading={isGenerating}
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
