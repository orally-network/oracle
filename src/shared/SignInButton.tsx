import { Button, ButtonProps } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

import logger from 'Utils/logger';
import useSignature from 'Shared/useSignature';

interface SignInButtonProps extends ButtonProps {
}
export const SignInButton = (props: SignInButtonProps) => {
  const [isSigning, setIsSigning] = useState(false);
  const { signMessage } = useSignature();
  const { chain: currentChain } = useAccount();

  const signMessageHandler = async () => {
    setIsSigning(true);
    try {
      await toast.promise(signMessage(currentChain?.id), {
        pending: `SIWE processing...`,
        success: `SIWE processed`,
        error: {
          render({ data }) {
            logger.error(`SIWE`, data);

            return 'Something went wrong. Try again later.';
          },
        },
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Button onClick={signMessageHandler} type="primary" loading={isSigning} {...props}>
      Sign message
    </Button>
  );
};
