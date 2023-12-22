import React, { useCallback } from 'react';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import { Pagination as AntdPagination, Flex } from 'antd';
import styles from './Pagination.scss';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { usePythiaData } from 'Providers/PythiaData';

interface PaginationProps {
  currentPage: number;
  total: number;
}

const itemRender: AntdPaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <div className={styles.controlBtn}><LeftOutlined /></div>;
  }
  if (type === 'next') {
    return <div className={styles.controlBtn}><RightOutlined /></div>;
  }
  return originalElement;
};

export const Pagination = ({currentPage, total}: PaginationProps) => {
  const { fetchSubs } = usePythiaData();
  
  const onPaginationChange = useCallback(async(page: number) => {
    await fetchSubs({ pagination: { page } });
  }, []);

  return (
    <Flex justify="end" className={styles.paginationContainer}>
      <AntdPagination
        current={Number(currentPage)}
        onChange={onPaginationChange}
        total={Number(total)}
        itemRender={itemRender}
      />
    </Flex>
  );
};
