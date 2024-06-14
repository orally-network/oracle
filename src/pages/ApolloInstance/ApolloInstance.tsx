import { Link as LinkUI, BreadcrumbItem, Breadcrumbs, Spinner, Card, Avatar } from '@nextui-org/react';
import { useParams, Navigate } from 'react-router-dom';
import { useMemo } from 'react';
import { formatEther } from 'viem';

import { CHAINS_MAP } from 'Constants/chains';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { useFetchApolloBalance, useFetchApolloInstances } from 'Services/apolloService';
import { AuthorizedActions } from 'Shared/AuthorizedActions';
import { ApolloTopUp } from 'Shared/ApolloTopUp';
import { ApolloAddSpender } from 'Shared/ApolloAddSpender';
import ROUTES from 'Constants/routes';
import { LogsTable } from 'Pages/ApolloInstance/LogsTable';
import { AddressSnippetWithLabel } from 'Components/AddressSnippet';

export const ApolloInstance = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;
  const { chainId } = useParams<{ chainId: string }>();

  const { data: apolloInstances, isLoading } = useFetchApolloInstances();

  const apolloInstance = useMemo(() => {
    return apolloInstances?.find((instance) => instance.chainId === Number(chainId));
  }, [apolloInstances, chainId]);

  const { data: balance, isLoading: isBalanceLoading } = useFetchApolloBalance(Number(chainId));

  if (!chainId) {
    return <Navigate to={ROUTES.APOLLO} replace/>;
  }

  if (!apolloInstance) {
    return <Spinner className="p-4"/>;
  }

  // console.log({ chainId, apolloInstance, isLoading, apolloInstances });

  return (
    <div>
      <div className={`flex justify-between ${isMobile ? 'flex-col' : ''}`}>
        <div className="flex flex-col">
          <Breadcrumbs radius="full" variant="solid" className="mb-2">
            <BreadcrumbItem href={ROUTES.APOLLO}>Apollo</BreadcrumbItem>
            <BreadcrumbItem>{CHAINS_MAP[chainId].name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <AuthorizedActions>
          <div className="flex items-center text-xl">
            Balance: {!balance || isBalanceLoading ? '...' : Number(formatEther(balance)).toFixed(3)} ETH
          </div>

          <ApolloTopUp
            apolloInstances={apolloInstances}
            isChainsLoading={isLoading}
          />

          <ApolloAddSpender
            apolloInstances={apolloInstances}
            isChainsLoading={isLoading}
          />
        </AuthorizedActions>
      </div>

      <div>
        <h3 className="text-xl font-bold">Apollo Instance: {CHAINS_MAP[chainId].name}</h3>

        <div className="flex flex-row my-4 justify-center">
          <Card className="flex flex-1 row gap-3 items-center justify-center max-w-48 h-40 mr-4">
            <Avatar src={CHAINS_MAP[apolloInstance.chainId].img}/>
            <LinkUI
              href={`${CHAINS_MAP[apolloInstance.chainId].blockExplorers.default.url}/address/${apolloInstance.evmAddress}`}
              color="foreground"
              className="text-lg"
              isExternal
              showAnchorIcon
            >
              {CHAINS_MAP[apolloInstance.chainId].name}
            </LinkUI>
          </Card>

          <Card className="flex justify-around w-48 p-4">
            <AddressSnippetWithLabel address={apolloInstance.apolloCoordinator} title="Coordinator Address"/>
            <AddressSnippetWithLabel address={apolloInstance.evmAddress} title="Executor Address"/>
          </Card>
        </div>

        <LogsTable instance={apolloInstance}/>
      </div>
    </div>
  );
};
