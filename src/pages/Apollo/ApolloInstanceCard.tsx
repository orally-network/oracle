import { Card, CardHeader, Avatar, CardFooter, Link } from '@nextui-org/react';
import { formatEther } from 'viem';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

import { type ApolloInstance, useFetchApolloBalance } from 'Services/apolloService';
import { CHAINS_MAP } from 'Constants/chains';
import { AddressSnippetWithLabel } from 'Components/AddressSnippet';
import ROUTES from 'Constants/routes';

import { InstanceCardBody } from './InstanceCardBody';

interface ApolloInstanceCardProps {
  instance: ApolloInstance;
}

export const ApolloInstanceCard = ({ instance }: ApolloInstanceCardProps) => {
  const { data: balance, isLoading: isBalanceLoading } = useFetchApolloBalance(instance.chainId);

  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    navigate(`/${ROUTES.APOLLO}/${instance.chainId}`);
  }, [instance]);

  return (
    <Card
      className="border-solid border-background2 border-2 hover:scale-105"
      onPress={handleCardClick}
      isPressable
    >
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
        <AddressSnippetWithLabel address={instance.apolloCoordinator} title="Coordinator Address"/>

        <AddressSnippetWithLabel address={instance.evmAddress} title="Executor Address"/>
      </CardFooter>
    </Card>
  );
};
