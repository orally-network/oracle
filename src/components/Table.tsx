import React from 'react';
import {
  Table as NextUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  TableProps as NextUITableProps,
} from '@nextui-org/react';

export interface Column {
  key: string;
  label: string;
  align?: 'start' | 'center' | 'end';
}

type Row = Record<string, string | number> & any;

interface TableProps extends NextUITableProps {
  ariaLabel?: string;
  columns: Column[];
  rows: Row[];
  renderCell?: (row: Row, columnKey: string) => React.ReactNode;
  isLoading: boolean;
  selectedKeys?: string[];
}

const defaultRenderCell = (row: Row, columnKey: string) => getKeyValue(row, columnKey);

export const Table = ({
  ariaLabel,
  columns,
  rows,
  renderCell = defaultRenderCell,
  isLoading,
  topContent,
  ...rest
}: TableProps) => {
  return (
    <NextUITable
      isStriped
      color="primary"
      aria-label={ariaLabel ?? 'Table'}
      topContent={topContent}
      {...rest}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} align={column.align}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={rows}
        isLoading={isLoading}
        loadingContent={<Spinner label="Loading..." />}
        emptyContent={'No rows to display.'}
      >
        {(item) => (
          <TableRow key={item.id}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-expect-error */}
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
};
