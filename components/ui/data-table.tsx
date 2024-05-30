'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea, ScrollBar } from './scroll-area';
import Search from './search';
import { QueryResponse } from '@/lib/entity/core/interface';
import Pagination from './pagination';
import { Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  response: QueryResponse<TData>;
  searchTitle: string;
  groupAction?: any;
}

export function DataTable<TData, TValue>({
  columns,
  response,
  searchTitle,
  groupAction,
}: DataTableProps<TData, TValue>) {
  const data = response.data;
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  /* this can be used to get the selectedrows */
  console.log('value', table.getFilteredSelectedRowModel());
  const isSelected = table.getFilteredSelectedRowModel().flatRows.length > 0;
  const selectedItems = table
    .getFilteredSelectedRowModel()
    .flatRows.map((row) => row.original);
  const GroupAction = groupAction;
  return (
    <>
      <div className="flex space-x-2 space-x-reverse space-y-2 md:space-y-0 flex-col md:flex-row">
        <Search placeholder={searchTitle} />
        {isSelected && groupAction && <GroupAction items={selectedItems} />}
      </div>
      <ScrollArea className="">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  عه!
                  <br />
                  خالیه که
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 space-x-reverse py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} از{' '}
          {table.getFilteredRowModel().rows.length} ردیف انتخاب شده
        </div>
        <div className="space-x-reverse space-x-2">
          <Pagination totalPages={response.totalPages} />
        </div>
      </div>
    </>
  );
}
