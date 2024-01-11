import logger from 'Utils/logger';
import { Button } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useSignature from 'Shared/useSignature';

interface SignInButtonProps {
  chain: any;
}
export const SignInButton = ({ chain }: SignInButtonProps) => {
  const [isSigning, setIsSigning] = useState(false);
  const { signMessage } = useSignature();

  const signMessageHandler = async () => {
    setIsSigning(true);
    try {
      await toast.promise(signMessage(chain?.id), {
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
    <Button onClick={signMessageHandler} type="primary" loading={isSigning}>
      Sign message
    </Button>
  );
};
