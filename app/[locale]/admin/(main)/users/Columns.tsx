"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  UserRoundPen,
  Trash2,
  Mail
} from "lucide-react";
import {STATUS_USER} from "@/app/constants/status";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: string;
  avatar: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const getUserColumns = (
  {
    onEdit,
    onDelete,
    onSendEmail
  } : {onEdit: any, onDelete: any, onSendEmail: any}
): ColumnDef<Users>[] => [
  {
    id: "checkAll",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "w-9",
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: {
      className: "w-9",
    },
  },
  {
    id: "user",
    header: "Users",
    accessorFn: row => `${row.name} ${row.email}`,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user?.profile?.avatar || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const data = row.original.profile;
      return (
        <div>
          <div className="font-medium">{data?.phone}</div>
          <div className="text-sm text-gray-500">{data?.address}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusData = row.original;
      const statusItem = STATUS_USER.find((item) => item.value === statusData.status);
      return <Badge>{statusItem?.label ?? "Không xác định"}</Badge>;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
            >
              <UserRoundPen/>
                Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
            >
              <Trash2/>
              Delete
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSendEmail(row.original)}
            >
              <Mail />
              Mail
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

