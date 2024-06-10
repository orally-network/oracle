import { Card, CardBody, CardHeader, Spinner, Avatar } from '@nextui-org/react';
import { formatEther } from 'viem';

import { type ApolloInstance, useGetParsedApolloCoordinatorLogs, useFetchApolloBalance } from 'Services/apolloService';
import { CHAINS_MAP } from 'Constants/chains';

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

  console.log(instance.chainId, { parsedLogs, balance });

  return (
    <Card className="">
      {isLoading ? (
        <Spinner className="p-4" />
      ) : (
        <>
          <CardHeader>
            <div className="flex flex-1 row gap-3 items-center">
              <Avatar src={CHAINS_MAP[instance.chainId].img} />

              <div className="text-lg">
                {CHAINS_MAP[instance.chainId].name}
              </div>
            </div>

            <div className="text-lg">
              Balance: {!balance || isBalanceLoading ? '...' : Number(formatEther(balance)).toFixed(3)} ETH
            </div>
          </CardHeader>
          <CardBody>
            Apollo Instance Card
          </CardBody>
        </>
      )}
    </Card>
  );
};
