import { Button } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';

import { TopUpModal } from 'Shared/TopUpModal';
import { useSybilBalanceStore, fetchBalanceAllowedChains, AllowedChain } from 'Stores/useSybilBalanceStore';

import { useSybilDeposit } from './useSybilDeposit';

export const SybilTopUp = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const allowedChains = useSybilBalanceStore((state) => state.allowedChains);
  const isChainsLoading = useSybilBalanceStore((state) => state.isChainsLoading);

  const [chain, setChain] = useState<AllowedChain | null>(null);

  const { isConfirming, sybilDeposit } = useSybilDeposit({ setIsModalVisible });

  const handleClose = useCallback(() => setIsModalVisible(false), []);

  useEffect(() => {
    fetchBalanceAllowedChains().then(chains => {
      setChain(chains[0]);
    });
  }, []);

  return  (
    <>
      <Button
        type="primary"
        size="large"
        onClick={openModal}
      >
        Top Up
      </Button>

      {chain && (
        <TopUpModal
          isOpen={isModalVisible}
          close={handleClose}
          chains={allowedChains}
          isChainsLoading={isChainsLoading}
          tokens={chain ? chain.tokens : []}
          submit={sybilDeposit}
          isConfirming={isConfirming}
          setChain={setChain}
          chain={chain}
        />
      )}
    </>
  )
};