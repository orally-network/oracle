import { Breadcrumb, Flex } from 'antd';
import { SybilBalance } from 'Shared/SybilBalance';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';

import { Actions } from './Actions';

export const APIKeys = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <div className={`flex justify-between ${isMobile ? 'flex-col' : ''}`}>
      <div className="flex flex-col">
        <Breadcrumb
          separator=">"
          items={[{ title: 'Sybil', href: '/sybil' }, { title: 'API Keys' }]}
        />
        <h3 className="text-xl font-bold">API Keys</h3>
      </div>

      <Flex align="center" justify="space-between" gap={8} vertical={isMobile}>
        <SybilBalance/>

        <Actions/>
      </Flex>
    </div>
  );
};
