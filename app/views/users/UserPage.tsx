"use client";

import { Button } from "@/components/ui/button";
import {Plus } from "lucide-react";

import React, {useState, useMemo, useEffect} from "react";

import { useTranslations } from "next-intl";
import { DataTable } from "@/app/[locale]/admin/(main)/users/DataTable";
import { columns } from "@/app/[locale]/admin/(main)/users/Columns";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  useReactTable, getPaginationRowModel,
} from "@tanstack/react-table";
import UserModal from "@/app/[locale]/admin/(main)/users/UserModal";
import {PaginationControls} from "@/app/[locale]/admin/(main)/components/PaginationComponent";



interface UserPageProps {
  dataUsers?: any;
}

export default function UserPage({  dataUsers }: UserPageProps) {
  const tUser = useTranslations("User");
  const tButton = useTranslations("Button");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [openModalUser, setOpenModalUser] = useState(false)
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState(dataUsers);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // mặc định 10 dòng/trang
  });
  const memoData = useMemo(() => users, [users]);

  const table = useReactTable({
    data: memoData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination
    },
  });



  const handleOpenModalUser = () => {
    setOpenModalUser(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {tUser("UserManagement")}
          </h1>
          <p className="text-gray-600 mt-1 dark:text-gray-200">
            {tUser("ManageAndOrganizeTeam")}
          </p>
        </div>
        <Button onClick={handleOpenModalUser} variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {tButton("AddUser")}
        </Button>
      </div>


      {/* Modal Add User */}
      <UserModal openModalUser={openModalUser} onClose={() => setOpenModalUser(false)}/>

      {/* Datatables */}
      <DataTable columns={columns} data={users} table={table} isLoading={isLoading} />

      {/* Pagination */}
      <PaginationControls
          currentPage={table?.getState().pagination.pageIndex}
          totalPages={table?.getPageCount()}
          setPage={table?.setPageIndex}
          canPreviousPage={table?.getCanPreviousPage()}
          canNextPage={table?.getCanNextPage()}
          previousPage={table?.previousPage}
          nextPage={table?.nextPage}
      />

    </>
  );
}
