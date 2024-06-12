import { Card, CardHeader, Avatar, CardFooter } from '@nextui-org/react';
import { formatEther } from 'viem';

import { type ApolloInstance, useFetchApolloBalance } from 'Services/apolloService';
import { CHAINS_MAP } from 'Constants/chains';

import { InstanceCardBody } from './InstanceCardBody';

interface ApolloInstanceCardProps {
  instance: ApolloInstance;
}

export const ApolloInstanceCard = ({ instance }: ApolloInstanceCardProps) => {
  const { data: balance, isLoading: isBalanceLoading } = useFetchApolloBalance(instance.chainId);

  return (
    <Card className="border-solid border-background2 border-2">
      <CardHeader>
        <div className="flex flex-1 row gap-3 items-center">
          <Avatar src={CHAINS_MAP[instance.chainId].img}/>

          <div className="text-lg">
            {CHAINS_MAP[instance.chainId].name}
          </div>
        </div>

        <div className="text-lg">
          Balance: {!balance || isBalanceLoading ? '...' : Number(formatEther(balance)).toFixed(3)} ETH
        </div>
      </CardHeader>

      <InstanceCardBody instance={instance}/>

      <CardFooter>
        Footer
      </CardFooter>
    </Card>
  );
};
