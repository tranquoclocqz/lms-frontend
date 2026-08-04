"use client";

import { createContext, useContext, ReactNode } from "react";

// Context chấp nhận bất kỳ kiểu dữ liệu T nào từ Server
const PageDataContext = createContext<any>(null);

export function PageDataProvider<T>({
    data,
    children,
}: {
    data: T;
    children: ReactNode;
}) {
    return (
        <PageDataContext.Provider value={data}>
            {children}
        </PageDataContext.Provider>
    );
}

// Custom Hook để lấy dữ liệu page bất kỳ ở component con
export function usePageData<T>(): T {
    const context = useContext(PageDataContext);
    if (!context) {
        throw new Error("usePageData phải được sử dụng bên trong PageDataProvider");
    }
    return context as T;
}