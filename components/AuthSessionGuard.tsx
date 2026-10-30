"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMeQuery } from "@/lib/redux/authApi";
import Loading from "./Loading";

export function AuthSessionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isLoginPage = pathname === "/login";
  const { isLoading, isFetching, isError } = useGetMeQuery(pathname, {
    skip: !hasMounted || isLoginPage,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isError && !isLoginPage) {
      const next = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [isError, isLoginPage, router]);

  if (!hasMounted || isLoginPage) {
    return children;
  }

  if (isLoading || isFetching || isError) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <Loading />
      </main>
    );
  }

  return children;
}
