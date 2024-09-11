import { Button, ButtonProps } from '@nextui-org/react';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

import logger from 'Utils/logger';
import useSignature from 'Shared/useSignature';

export const SignInButton = (props: ButtonProps) => {
  const [isSigning, setIsSigning] = useState(false);
  const { signMessage } = useSignature();
  const { chain: currentChain } = useAccount();

  const signMessageHandler = async () => {
    setIsSigning(true);
    try {
      toast.promise(signMessage(currentChain?.id), {
        loading: `SIWE processing...`,
        success: `SIWE processed`,
        error: ({ data }) => {
          logger.error(`SIWE`, data);

          return 'Something went wrong. Try again later.';
        },
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Button onClick={signMessageHandler} color="primary" loading={isSigning} {...props}>
      Sign message
    </Button>
  );
};
