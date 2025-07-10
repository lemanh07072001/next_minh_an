export async function generateMetadata({ params }: { params: { locale: string } }) {
const {locale} = await params;
  return {
    title: locale === "vi" ? "Quản lý người dùng" : "Users Manager",
  };
}

import UserPage from "@/app/views/users/UserPage";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

async function fetchUserData(token?: string, locale: string = "vi") {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API_BACKEND}/user/get-users`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          "X-Locale": locale,
        },
        // Next.js bắt buộc với server-side fetch nếu có token:
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function fetchStatusUserData(token?: string, locale: string = "vi") {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API_BACKEND}/status/user`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          "X-Locale": locale,
        },

        // Next.js bắt buộc với server-side fetch nếu có token:
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function Users({
  params,
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  const {locale} = await params;

  // if (!token) {
  //   redirect("/403"); // Hoặc `/en/403` nếu dùng đa ngôn ngữ
  // }

  const userData = await fetchUserData(token, locale);
  const statusData = await fetchStatusUserData(token, locale);

  // (Tùy bạn) Nếu API không trả về user:
  // if (!userData) {
  //   redirect("/403"); // Hoặc hiển thị thông báo lỗi tùy ý
  // }

  return <UserPage statusData={statusData} dataUsers={userData?.data || []} />;
}
