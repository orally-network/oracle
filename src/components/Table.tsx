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
} from '@nextui-org/react';

export interface Column {
  key: string;
  label: string;
  align?: 'start' | 'center' | 'end';
}

type Row = Record<string, string | number> & any;

interface TableProps {
  ariaLabel?: string;
  columns: Column[];
  rows: Row[];
  renderCell?: (row: Row, columnKey: string) => React.ReactNode;
  isLoading: boolean,
  topContent?: React.ReactNode;
}

const defaultRenderCell = (row: Row, columnKey: string) => getKeyValue(row, columnKey);

export const Table = ({
  ariaLabel,
  columns,
  rows,
  renderCell = defaultRenderCell,
  isLoading,
  topContent,
}: TableProps) => {
  return (
    <NextUITable
      isStriped
      aria-label={ariaLabel ?? 'Table'}
      topContent={topContent}
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
            {/* @ts-ignore */}
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </NextUITable>
  );
};
