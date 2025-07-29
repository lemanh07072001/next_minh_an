"use client";

import { Button } from "@/components/ui/button";
import {Plus } from "lucide-react";

import React, {useState, useMemo, useEffect} from "react";

import { useTranslations } from "next-intl";
import { DataTable } from "@/app/[locale]/admin/(main)/users/DataTable";
import { getUserColumns } from "@/app/[locale]/admin/(main)/users/Columns";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  useReactTable, getPaginationRowModel,
} from "@tanstack/react-table";
import UserModal from "@/app/[locale]/admin/(main)/users/UserModal";
import {PaginationControls} from "@/app/[locale]/admin/(main)/components/PaginationComponent";
import api from "@/lib/axios";
import {ConfirmDelete} from "@/app/[locale]/admin/(main)/users/ConfirmDelete";
import {toast} from "sonner";
import {SendEmail} from "@/app/[locale]/admin/(main)/users/SendEmail";



interface UserPageProps {
  dataUsers?: any;
}

export default function UserPage({  dataUsers }: UserPageProps) {
  const tUser = useTranslations("User");
  const tButton = useTranslations("Button");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [openModalUser, setOpenModalUser] = useState(false)
  const [openConfirmModalUser, setOpenConfirmModalUser] = useState(false)
  const [openModalSendEmailUser, setOpenModalSendEmailUser] = useState(false)
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState(dataUsers);
  const [userEdit, setUserEdit] = useState();
  const [userDelete, setUserDelete] = useState();
  const [isMode, setMode] = useState('create');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // mặc định 10 dòng/trang
  });
  const memoData = useMemo(() => users, [users]);

  const loadUsers = async () => {
    const res = await api.get('/user/get-users');
    setUsers(res.data.data)
  };


  const handleOpenEditModal = (user: any) => {
    setMode("edit");        // Đặt chế độ modal là 'edit' (chỉnh sửa)
    setUserEdit(user);                // Gán ID user được chọn để load dữ liệu
    setOpenModalUser(true); // Hiển thị modal
  }

  const handleOpenConfirmDelete = (user: any) => {
    setUserDelete(user) // Gán user vào
    setOpenConfirmModalUser(true) // Hiển thị modal
  }

  const handleSendEmailModal = (user: any) => {
    setOpenModalSendEmailUser(true); // Hiển thị modal
  }

  const handleSumitDelete = async (user: any)=> {
    try {
      const id = userDelete?.id;

      if (!id) return

      const res = await api.delete(`/user/delete/${id}`)

      if (res.status === 200) {
        // ✅ đóng modal
        setOpenConfirmModalUser(false)           // Đóng modal
        // Hiện thông báo thành công
        toast.success("Thành công!", {
          description: res.data.message,
        });

        // 🔄 Reload lại bảng
        await loadUsers()
      }
    }catch(error) {
      console.error(error);
      // Hiện thông báo thất bại
      toast.error("Thất bại", {
        description: "Lỗi hệ thống vui lòng thử lại sau.",
      });
    }
  }

  const handleOpenModalUser = () => {
    setMode('create');        // Đặt chế độ modal là 'create' (thêm mới)
    setOpenModalUser(true)    // Hiển thị modal
  }

  // Lấy danh sách các cột của bảng user
  const columns = getUserColumns({ onEdit: handleOpenEditModal, onDelete: handleOpenConfirmDelete, onSendEmail: handleSendEmailModal });

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
      <UserModal
        openModalUser={openModalUser}
        user={userEdit}
        isMode={isMode}
        reloadUser={loadUsers}
        onClose={() => setOpenModalUser(false)} />

      {/* Datatables */}
      <DataTable
        columns={columns}
        data={users}
        table={table}
        isLoading={isLoading} />

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

      {/* Confirm Delete */}
      <ConfirmDelete
        openModal={openConfirmModalUser}
        onConfirm={handleSumitDelete}
        user={userDelete}
        onClose={() => setOpenConfirmModalUser(false)}/>

      {/* Send Email */}
      <SendEmail
        openModal={openModalSendEmailUser}
        user={userDelete}
        onClose={() => setOpenModalSendEmailUser(false)}/>
    </>
  );
}
