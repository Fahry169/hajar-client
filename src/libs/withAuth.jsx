"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "authorization";
const LOGIN_ROUTE = "/";

export const setAuthToken = (token) => {
  Cookies.set(AUTH_COOKIE_NAME, token, { expires: 1 / 24 }); // 1 jam
  console.log("Token disimpan ke cookie");
};

export const logout = (router) => {
  Cookies.remove(AUTH_COOKIE_NAME);
  console.log("Token dihapus, redirect ke landing page");
  router.push(LOGIN_ROUTE);
};

const isAuthenticated = () => Boolean(Cookies.get(AUTH_COOKIE_NAME));

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [authed, setAuthed] = useState(false);

    useEffect(() => {
      const token = searchParams.get("token");

      if (token) {
        setAuthToken(token);
        router.replace(pathname);
        setAuthed(true);
        return;
      }

      if (isAuthenticated()) {
        console.log("Token valid, user login");
        setAuthed(true);
      } else {
        console.log("Tidak ada token, redirect");
        router.push(LOGIN_ROUTE);
      }
    }, [pathname, searchParams, router]);

    return authed ? <Component {...props} /> : null;
  };
}
