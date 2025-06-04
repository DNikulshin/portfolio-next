import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/shared/lib/session";

const protectedRoutes = ["/admin"];
const publicRoutes = ["/", "/login", "/register"];

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const path = url.pathname;

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);


    const redirectTo = (destination: string) => {
        return NextResponse.redirect(new URL(destination, url));
    };

    // Проверка роли пользователя
    // const userRole = session?.userRole; 


    if (isProtectedRoute && session?.userId) {
        if (isPublicRoute && (path === "/login" || path === "/register")) {
            return redirectTo("/admin");
        }

        return NextResponse.next();
    }

    if (isProtectedRoute && !session?.userId) {
        return redirectTo("/login");
    }
    return NextResponse.next();

}
