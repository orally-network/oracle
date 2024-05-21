import React, { useState, useEffect } from 'react';
import { Flex } from 'antd';
import { useGlobalState } from 'Providers/GlobalState';

import styles from './Balances.module.scss';
import { remove0x } from 'Utils/addressUtils';
import { SecondaryButton } from 'Components/SecondaryButton';
import { DownloadOutlined } from '@ant-design/icons';
import ChainLogo from 'Shared/ChainLogo';
import { CHAINS_MAP } from 'Constants/chains';
import Loader from 'Components/Loader';
import { TopUpPythiaModal } from 'Shared/Control/TopUpModal';
import { usePythiaData } from 'Providers/PythiaData';
import { Chain } from 'Interfaces/chain';
import { SignInButton } from 'Shared/SignInButton';
import { useCurrentCanister } from 'Canisters/useCurrentCanister';
import sybilCanister from 'Canisters/sybilCanister';

type ChainBalance = {
  chainId: string | number;
  balance: number;
};

export const Balances = () => {
  const { currentCanister } = useCurrentCanister();
  const [balances, setBalances] = useState<ChainBalance[]>([]);
  const [activeChain, setActiveChain] = useState<Chain>();
  const [isBalancesLoading, setIsBalancesLoading] = useState(false);
  const { chains, isChainsLoading, addressData } = useGlobalState();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);

  const { pma } = usePythiaData();

  const fetchSybilBalances = async () => {
    setIsBalancesLoading(true);

    try {
      const balance = await sybilCanister.get_balance(remove0x(addressData?.address));
      setBalances([
        {
          chainId: 42161, // Arbitrum
          balance: balance.Ok || Number(balance.Ok) === 0 ? balance.Ok : 0,
        }
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsBalancesLoading(false);
    }
  }

  const fetchBalances = async () => {
    if (!currentCanister) return;
    setIsBalancesLoading(true);
    const balancePromises = chains.map((chain) =>
      currentCanister.canister.get_balance(chain.chain_id, remove0x(addressData?.address))
    );

    try {
      const balances = await Promise.all(balancePromises);
      const chainBalances: ChainBalance[] = chains.map((chain, index) => ({
        chainId: chain.chain_id,
        balance: balances[index].Ok || Number(balances[index].Ok) === 0 ? balances[index].Ok : 0,
      }));
      setBalances(chainBalances);
    } catch (e) {
      console.log(e);
    } finally {
      setIsBalancesLoading(false);
    }
  };

  useEffect(() => {
    if (!addressData || !addressData.address || !currentCanister) return;
    if (currentCanister && currentCanister.name === 'sybil') {
      fetchSybilBalances();
    } else {
      fetchBalances();
    }
  }, [chains, addressData, currentCanister]);

  const openTopUpModal = (chainId: string) => {
    setActiveChain(CHAINS_MAP[chainId]);
    setIsTopUpModalOpen(true);
  };

  if (!addressData || !addressData.signature) return <SignInButton chain={chains[0]} />;

  return (
    <>
      <Flex vertical style={{ width: '100%', height: '100%' }}>
        {isChainsLoading || isBalancesLoading ? (
          <Flex align="center" justify="center" style={{ height: 'calc(100vh - 200px)' }}>
            <Loader />
          </Flex>
        ) : (
          balances?.map((item, index) => (
            <Flex key={index} className={styles.listItem} justify="space-between">
              <Flex gap="small" align="center">
                <Flex className={styles.logo} justify="center" align="center">
                  <ChainLogo chain={CHAINS_MAP[item.chainId]} />
                </Flex>
                <Flex vertical>
                  <div className={styles.label}>
                    {CHAINS_MAP[item.chainId].nativeCurrency.symbol}
                  </div>
                  <div>
                    {(
                      Number(item.balance) /
                      Math.pow(10, CHAINS_MAP[item.chainId].nativeCurrency.decimals)
                    ).toFixed(3) ?? '-'}
                  </div>
                </Flex>
              </Flex>
              <SecondaryButton
                icon={<DownloadOutlined />}
                className={styles.topUp}
                onClick={() => openTopUpModal(item.chainId as string)}
              >
                Top up
              </SecondaryButton>
            </Flex>
          ))
        )}
      </Flex>
      {isTopUpModalOpen && (
        <TopUpPythiaModal
          isTopUpModalOpen={isTopUpModalOpen}
          setIsTopUpModalOpen={setIsTopUpModalOpen}
          chain={activeChain}
          executionAddress={pma}
          refetchBalance={fetchBalances}
          decimals={activeChain?.nativeCurrency?.decimals}
          symbol={activeChain?.nativeCurrency?.symbol}
        />
      )}
    </>
  );
};
