import React from 'react';
import {
  Table as NextUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';

interface Column {
  key: string;
  label: string;
  align?: 'start' | 'center' | 'end';
}

interface Row {
  [key: string]: string | number;
}

interface TableProps {
  ariaLabel?: string;
  columns: Column[];
  rows: Row[];
  renderCell?: (row: Row, columnKey: string) => React.ReactNode;
  isLoading: boolean,
}

const defaultRenderCell = (row: Row, columnKey: string) => getKeyValue(row, columnKey);

export const Table = ({
  ariaLabel,
  columns,
  rows,
  renderCell = defaultRenderCell,
  isLoading,
}: TableProps) => {
  return (
    <NextUITable
      isStriped
      aria-label={ariaLabel ?? 'Table'}
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
