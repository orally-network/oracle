import { BreadcrumbItem, Breadcrumbs, Spinner } from '@nextui-org/react';

import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { useFetchApolloInstances, type ApolloInstance } from 'Services/apolloService';
import { AuthorizedActions } from 'Shared/AuthorizedActions';
import { ApolloTopUp } from 'Shared/ApolloTopUp';

import { ApolloInstanceCard } from './ApolloInstanceCard';

export const Apollo = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const { data: apolloInstances, isLoading } = useFetchApolloInstances();

  return (
    <div>
      <div className={`flex justify-between ${isMobile ? 'flex-col' : ''}`}>
        <div className="flex flex-col">
          <Breadcrumbs radius="full" variant="solid" className="mb-2">
            <BreadcrumbItem>Apollo</BreadcrumbItem>
          </Breadcrumbs>
          <h3 className="text-xl font-bold">Apollo</h3>
        </div>

        <AuthorizedActions>
          <ApolloTopUp
            apolloInstances={apolloInstances}
            isChainsLoading={isLoading}
          />
        </AuthorizedActions>
      </div>

      {isLoading ? (
        <Spinner className="flex justify-center items-center h-64"/>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {apolloInstances?.map((instance: ApolloInstance) => (
            <ApolloInstanceCard
              key={instance.chainId}
              instance={instance}
            />
          ))}
        </div>
      )}
    </div>
  );
};
