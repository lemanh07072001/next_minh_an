"use client";
import {Lock, Mail, Search, Trash2, Users} from "lucide-react";

import {
  ColumnDef,
  flexRender,
  Table as TanStackTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Card, CardContent} from "@/components/ui/card";
import Loading from "@/app/[locale]/admin/(main)/users/Loading";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import React, {useState} from "react";
import {useTranslations} from "next-intl";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/ui/button";
import {STATUS_USER} from "@/app/constants/status";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: TanStackTable<TData>;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  table,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const tLocale = useTranslations("Locale");
  const countCheckBoxSelect = table.getFilteredSelectedRowModel().rows.length;


  const dataStatus = STATUS_USER;
  const defaultStatus = dataStatus[0];

  // Animation common config
  const animationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3 },
  };


  /* ① Ổn định reference của data */
  return (
    <Card>
      <div className="px-4 pb-4 border-b ">
        <div className="flex items-center justify-between  w-full">
          <AnimatePresence mode="wait" >
            {countCheckBoxSelect > 0 ? (
                <motion.div key="action-bar" {...animationProps} className=" w-full h-[36px]">
                  <div className="flex items-center justify-between  w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-900 dark:text-gray-50">
                          Đã {countCheckBoxSelect} chọn người dùng
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-transparent"
                      >
                        <Mail className="w-4 h-4" />
                        Gửi Email
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-transparent"
                      >
                        <Lock className="w-4 h-4" />
                        Khóa Tài Khoản
                      </Button>
                      <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa Tất Cả
                      </Button>
                    </div>
                  </div>
                </motion.div>
            ) : (
                <motion.div key="filter-bar" {...animationProps} className=" w-full" >
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    {/* Pagination size */}
                    <Select
                        value={String(table.getState().pagination.pageSize)}
                        onValueChange={(value) => table.setPageSize(Number(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Search input */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder={`${tLocale("SearchUser")} ...`}
                            onChange={(event) => {
                              table.getColumn("user")?.setFilterValue(event.target.value);
                            }}
                            className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Status filter */}
                    <Select
                        onValueChange={(value) => {
                          const filterValue = value === "all" ? undefined : value;
                          table.getColumn("status")?.setFilterValue(filterValue);
                        }}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder={`${tLocale("Status")}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {dataStatus.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Table>
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
          {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loading />
                </TableCell>
              </TableRow>
          ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                  <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell
                            key={cell.id}
                            className={cell.column.columnDef.meta?.className}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                  </TableRow>
              ))
          ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
