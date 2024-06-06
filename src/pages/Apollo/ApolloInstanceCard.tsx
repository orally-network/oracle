import { Card, CardBody, CardHeader, CardFooter, Spinner } from '@nextui-org/react';

import { type ApolloInstance, useGetParsedApolloCoordinatorLogs } from 'Services/apolloService';

interface ApolloInstanceCardProps {
  instance: ApolloInstance;
}

export const ApolloInstanceCard = ({ instance }: ApolloInstanceCardProps) => {
  const { data: parsedLogs, isLoading } = useGetParsedApolloCoordinatorLogs(
    instance.chainId,
    instance.apolloCoordinator,
    true
  );

  // console.log(instance.chainId, { parsedLogs });

  return (
    <Card>
      {isLoading ? (
          <Spinner />
        ) : (
        <CardBody>
          Apollo Instance Card
        </CardBody>
        )}
    </Card>
  );
};
