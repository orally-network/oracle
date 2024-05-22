import { Breadcrumb, Flex, Layout, Typography } from 'antd';
import { SybilBalance } from 'Shared/SybilBalance';
import { BREAK_POINT_MOBILE } from 'Constants/ui';
import useWindowDimensions from 'Utils/useWindowDimensions';

import { Actions } from './Actions';

export const APIKeys = () => {
  const { width } = useWindowDimensions();
  const isMobile = width <= BREAK_POINT_MOBILE;

  return (
    <Layout.Content title="Sybil">
      <Flex gap="middle" justify="space-between" vertical={isMobile}>
        <Flex vertical>
          <Breadcrumb
            separator=">"
            items={[{ title: 'Sybil', href: '/sybil' }, { title: 'API Keys' }]}
          />
          <Typography.Title level={3}>API Keys</Typography.Title>
        </Flex>

        <Flex align="center" justify="space-between" gap={8} vertical={isMobile}>
          <SybilBalance/>

          <Actions/>
        </Flex>
      </Flex>
    </Layout.Content>
  );
};
