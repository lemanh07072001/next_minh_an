"use client"

import {useEffect} from "react";
import {createApiInstance} from "@/lib/axios";


export default function DashboardPage() {

    useEffect(() => {
        async function fetchUser() {
            try {
                const api = createApiInstance();

                const res = await api.get("/user/get-users");
                console.log(res)
            } catch (err: any) {
                console.error("Error fetching user", err);

            } finally {

            }
        }

        fetchUser();
    }, []);
    return (
        <h1>Dashboard</h1>
    )
}