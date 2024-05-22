import React from 'react';
import type { PaginationProps as AntdPaginationProps } from 'antd';
import { Pagination as AntdPagination, Flex } from 'antd';
import styles from './Pagination.module.scss';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

interface PaginationProps {
  currentPage: number;
  total: number;
  setPage: (page: number) => void;
  pageSize: number;
}

const itemRender: AntdPaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return (
      <div className={styles.controlBtn}>
        <LeftOutlined />
      </div>
    );
  }
  if (type === 'next') {
    return (
      <div className={styles.controlBtn}>
        <RightOutlined />
      </div>
    );
  }
  return originalElement;
};

export const Pagination = ({ currentPage, total, setPage, pageSize }: PaginationProps) => {
  return (
    <Flex justify="end" className={styles.paginationContainer}>
      <AntdPagination
        current={Number(currentPage)}
        onChange={(page) => setPage(page)}
        total={Number(total)}
        itemRender={itemRender}
        pageSize={pageSize}
      />
    </Flex>
  );
};
