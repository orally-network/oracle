import { Card, CardBody, CardHeader, Spinner, Avatar } from '@nextui-org/react';

import { type ApolloInstance, useGetParsedApolloCoordinatorLogs } from 'Services/apolloService';
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

  console.log(instance.chainId, { parsedLogs });

  return (
    <Card className="">
      {isLoading ? (
        <Spinner className="p-4" />
      ) : (
        <>
          <CardHeader>
            <Avatar src={CHAINS_MAP[instance.chainId].img} />


          </CardHeader>
          <CardBody>
            Apollo Instance Card
          </CardBody>
        </>
      )}
    </Card>
  );
};
