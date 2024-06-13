import { Card, CardHeader, Avatar, CardFooter, Link } from '@nextui-org/react';
import { formatEther } from 'viem';

import { type ApolloInstance, useFetchApolloBalance } from 'Services/apolloService';
import { CHAINS_MAP } from 'Constants/chains';
import { AddressSnippet } from 'Components/AddressSnippet';

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

          <Link
            href={`${CHAINS_MAP[instance.chainId].blockExplorers.default.url}/address/${instance.evmAddress}`}
            color="foreground"
            className="text-lg"
            isExternal
            showAnchorIcon
          >
            {CHAINS_MAP[instance.chainId].name}
          </Link>
        </div>

        <div className="text-lg">
          Balance: {!balance || isBalanceLoading ? '...' : Number(formatEther(balance)).toFixed(3)} ETH
        </div>
      </CardHeader>

      <InstanceCardBody instance={instance}/>

      <CardFooter className="flex justify-around w-full">
        <AddressSnippet address={instance.apolloCoordinator} title="Coordinator Address"/>

        <AddressSnippet address={instance.evmAddress} title="Executor Address"/>
      </CardFooter>
    </Card>
  );
};
