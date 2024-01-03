import { CHAINS_MAP } from 'Constants/chains';
import { Chain, ExplorerType } from 'Interfaces/chain';
import { InternalTransaction } from 'Interfaces/transaction';
import { useEffect, useState } from 'react';
import config from 'Constants/config';
import { isAddressHasOx } from 'Utils/addressUtils';

interface UseInternalTransactionsProps {
  contractAddress: string;
  chainId: number;
}

interface UseInternalTransactionsResult {
  isLoading: boolean;
  transactions: InternalTransaction[];
}

const getExplorerUrl = (chain: Chain, address: string) => {
  // goerli.lineascan.build/api?module=account&action=txlistinternal&address=0xB28f077244021BD84C878798b712e1D9B0FBC7Da&startblock=0&endblock=2702578&page=1&offset=10&sort=asc&apikey=FBXVNSRQN987A7FXMT455GE2XG7NPF7K6V
  switch (chain.explorerType as ExplorerType) {
    case ExplorerType.ScanExplorer:
      return `https://rpc.orally.network/?rpc=${
        chain.blockExplorers.default.url
      }${encodeURIComponent(
        `api?module=account&action=txlistinternal&address=${isAddressHasOx(
          address
        )}&sort=asc&apikey=${config.ETHERSCAN_API_KEY}`
      )}`;
    // &startblock=0
    // &endblock=2702578
    // &page=1
    // &offset=10
    case ExplorerType.BlockscoutExplorer:
      return `https://rpc.orally.network/?rpc=${
        chain.blockExplorers.default.url
      }${encodeURIComponent(
        `api?module=account&action=txlistinternal&address=${address}&sort=asc`
      )}`;
    // &startblock=555555
    // &endblock=666666
    // &page=1
    // &offset=5
    default:
      return null;
  }
};

export const useInternalTransactions = ({
  chainId,
  contractAddress,
}: UseInternalTransactionsProps): UseInternalTransactionsResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<InternalTransaction[]>([]);

  const chain = CHAINS_MAP[chainId];
  const explorerUrl: string | null = getExplorerUrl(chain, contractAddress);

  useEffect(() => {
    const getInternalTransactions = async (url: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        console.log(response, 'response getInternalTransactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (explorerUrl !== null) {
      console.log(explorerUrl, 'explorerUrl');
      getInternalTransactions(explorerUrl);
    }
  }, []);

  return {
    isLoading,
    transactions,
  };
};
