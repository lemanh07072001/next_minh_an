"use client";


import {Button} from "@/components/ui/button";
import {Plus, Search, Mail, Lock, Trash2} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {createApiInstance} from "@/lib/axios";

import {Card, CardContent} from "@/components/ui/card";
import {useTranslations} from "next-intl";

interface UserPageProps {
    statusData?: any
}

export default function UserPage({statusData}: UserPageProps) {
    const [status, setStatus] = useState([]);

    const tUser = useTranslations("User");
    const tButton = useTranslations("Button");
    const tLocale = useTranslations("Locale");

    console.log(statusData)
    useEffect(() => {
        const getStatus = async () => {
            const api = createApiInstance();
            const res = await api.get("/status/user");
            setStatus(res.data);
        };

        getStatus();
    }, []);
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{tUser('UserManagement')}</h1>
                    <p className="text-gray-600 mt-1 dark:text-gray-200">
                        {tUser('ManageAndOrganizeTeam')}
                    </p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4"/>
                    {tButton('AddUser')}
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search
                                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <Input placeholder={`${tLocale('SearchUser')} ...`} className="pl-10"/>
                            </div>
                        </div>
                        <Select>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder={`${tLocale('Status')}`}/>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(statusData).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select> */}
                    </div>
                </CardContent>
            </Card>

            {/* Bulk Actions Bar */}
            <Card>
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
                                <Mail className="w-4 h-4"/>
                                Gửi Email
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-transparent"
                            >
                                <Lock className="w-4 h-4"/>
                                Khóa Tài Khoản
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4"/>
                                Xóa Tất Cả
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}