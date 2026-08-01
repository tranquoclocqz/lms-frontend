import type { Metadata } from "next";
import { AuthNavbar } from "@/components/AuthNavbar";
import { ReduxProvider } from "@/components/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrainCourse LMS",
  description: "Nền tảng quản lý và học tập khóa học trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <AuthNavbar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
