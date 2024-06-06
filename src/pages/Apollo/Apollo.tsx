import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/react';

import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';
import { useFetchApolloInstances } from 'Services/apolloService';

export const Apollo = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  const { data } = useFetchApolloInstances();

  console.log({ data });

  return (
    <div>
      <div className={`flex justify-between ${isMobile ? 'flex-col' : ''}`}>
        <div className="flex flex-col">
          <Breadcrumbs radius="full" variant="solid" className="mb-2">
            <BreadcrumbItem>Apollo</BreadcrumbItem>
          </Breadcrumbs>
          <h3 className="text-xl font-bold">Apollo</h3>
        </div>
      </div>


    </div>
  )
};
