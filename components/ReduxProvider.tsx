"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { AuthSessionGuard } from "@/components/AuthSessionGuard";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthSessionGuard>{children}</AuthSessionGuard>
    </Provider>
  );
}
