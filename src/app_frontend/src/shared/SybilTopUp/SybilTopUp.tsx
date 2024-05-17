import { Button } from 'antd';
import React, { useState, useCallback } from 'react';

import { useGlobalState } from 'Providers/GlobalState';
import { useSybilDeposit } from 'Shared/SybilTopUp/useSybilDeposit';
import { TopUpModal } from 'Shared/TopUpModal';

export const SybilTopUp = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  // todo: get chains and currencies from sybil
  const { chains, isChainsLoading } = useGlobalState();
  const { isConfirming, sybilDeposit } = useSybilDeposit({ setIsModalVisible });

  return  (
    <>
      <Button
        type="primary"
        size="large"
        onClick={openModal}
      >
        Top Up
      </Button>

      <TopUpModal
        isOpen={isModalVisible}
        close={() => setIsModalVisible(false)}
        chains={chains}
        isChainsLoading={isChainsLoading}
        tokens={[]}
        targetAddress=""
        submit={sybilDeposit}
        isConfirming={isConfirming}
      />
    </>
  )
};