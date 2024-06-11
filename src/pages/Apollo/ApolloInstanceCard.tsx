import { Card, CardHeader, Spinner, Avatar, CardFooter } from '@nextui-org/react';
import { formatEther } from 'viem';

import { type ApolloInstance, useGetParsedApolloCoordinatorLogs, useFetchApolloBalance } from 'Services/apolloService';
import { CHAINS_MAP } from 'Constants/chains';

import { InstanceCardBody } from './InstanceCardBody';

interface ApolloInstanceCardProps {
  instance: ApolloInstance;
}

export const ApolloInstanceCard = ({ instance }: ApolloInstanceCardProps) => {
  const { data: parsedLogs, isLoading } = useGetParsedApolloCoordinatorLogs(
    instance.chainId,
    instance.apolloCoordinator,
    true
  );

  const { data: balance, isLoading: isBalanceLoading } = useFetchApolloBalance(instance.chainId);

  // console.log(instance.chainId, { parsedLogs, balance });

  // + parse multicall for response

  return (
    <Card className="border-solid border-background2 border-2">
      {isLoading ? (
        <Spinner className="p-4"/>
      ) : (
        <>
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

          {parsedLogs && parsedLogs[0] ? (
            <InstanceCardBody parsedLog={parsedLogs[0]}/>
          ) : (
            <div className="bg-background items-center justify-center text-center text-lg">
              None
            </div>
          )}

          <CardFooter>
            Footer
          </CardFooter>
        </>
      )}
    </Card>
  );
};
