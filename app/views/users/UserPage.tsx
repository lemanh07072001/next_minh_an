"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Mail, Lock, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { DataTable } from "@/app/[locale]/admin/(main)/users/DataTable";
import { columns, Users } from "@/app/[locale]/admin/(main)/users/Columns";
import { Suspense } from "react";
import Loading from "@/app/[locale]/admin/(main)/users/Loading";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import UserModal from "@/app/[locale]/admin/(main)/users/UserModal";

interface UserPageProps {
  statusData?: any;
  dataUsers?: any;
}

export default function UserPage({ statusData, dataUsers }: UserPageProps) {
  const tUser = useTranslations("User");
  const tButton = useTranslations("Button");
  const tLocale = useTranslations("Locale");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [openModalUser, setOpenModalUser] = useState(false)

  const memoData = useMemo(() => dataUsers, [dataUsers]);

  const table = useReactTable({
    data: memoData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
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

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={`${tLocale("SearchUser")} ...`}
                  value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
                   onChange={(event) =>
            table.getColumn("user")?.setFilterValue(event.target.value)
          }
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={`${tLocale("Status")}`} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusData).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {/* <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900 dark:text-gray-50">
                Đã chọn người dùng
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
        </CardContent>
      </Card> */}
      {/* Modal Add User */}
      <UserModal openModalUser={openModalUser} onClose={() => setOpenModalUser(false)}/>

      {/* Datatables */}
      <Suspense fallback={<Loading />}>
        <DataTable columns={columns} data={dataUsers} table={table} />
      </Suspense>
    </>
  );
}
