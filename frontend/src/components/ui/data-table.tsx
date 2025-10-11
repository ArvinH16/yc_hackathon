"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
}

export function DataTable<TData, TValue>({ columns, data, isLoading, pageSize = 10, emptyMessage = "No results", toolbar, }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [viewMode, setViewMode] = React.useState<'table' | 'cards'>('table');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2">
        <Input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="w-full md:w-48"
          aria-label="Search"
        />
        {toolbar && <div className="flex flex-wrap gap-2">{toolbar}</div>}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto rounded-md border">
          <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" && <span aria-hidden>▲</span>}
                      {h.column.getIsSorted() === "desc" && <span aria-hidden>▼</span>}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(pageSize)].map((_, i) => (
                <TableRow key={`s-${i}`}>
                  {table.getAllLeafColumns().map((c) => (
                    <TableCell key={c.id}><Skeleton className="h-4 w-full" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState title={emptyMessage} description="Try adjusting filters or search." />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-3 md:hidden">
          {isLoading ? (
            [...Array(pageSize)].map((_, i) => (
              <Card key={`s-${i}`} className="p-4">
                <div className="space-y-2">
                  {[...Array(3)].map((__, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </Card>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Card key={row.id} className="p-4">
                {row.getVisibleCells().map((cell) => {
                  const headerValue = typeof cell.column.columnDef.header === 'string'
                    ? cell.column.columnDef.header
                    : cell.column.id;
                  return (
                    <div key={cell.id} className="mb-2 last:mb-0">
                      <div className="text-xs text-muted-foreground">
                        {headerValue}
                      </div>
                      <div className="font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </div>
                  );
                })}
              </Card>
            ))
          ) : (
            <Card className="p-4">
              <EmptyState title={emptyMessage} description="Try adjusting filters or search." />
            </Card>
          )}
        </div>
      )}

      <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center">
        <div className="text-xs text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(table.getState().pagination.pageSize)} onChange={(e) => table.setPageSize(Number(e.target.value))} aria-label="Rows per page" className="w-24">
            {[10, 20, 30, 40, 50].map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </Select>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
