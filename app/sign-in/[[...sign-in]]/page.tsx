import Link from "next/link";

export default async function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Đăng nhập</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Chức năng đăng nhập hiện đang được giữ ở chế độ demo. Bạn có thể tiếp tục khám phá giao diện và học tập ngay.
        </p>
        <Link
          href="/student/courses"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Vào marketplace
        </Link>
      </div>
    </main>
  );
}
