import {cookies} from "next/headers";

export const metadata = {
    title: "Dashboard | MyWebsite",
};

import {createApiInstance} from "@/lib/axios";
import DashboardPage from "@/app/views/dashboards/DashboardPage";


export default async function Dashboards() {
    const cookieStore = await cookies(); // lấy cookies ở server
    const token = cookieStore.get("token")?.value;

    console.log(cookieStore)
    const api = createApiInstance(token); // truyền token vào axios

    const res = await api.get("/user/get-users");
    const users = res.data;
    return (
        <DashboardPage users={users}/>
    )
}