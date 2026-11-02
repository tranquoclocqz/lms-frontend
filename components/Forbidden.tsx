import { SVGProps } from "react";

export default function Forbidden({...props}) {
    function ExclamationTriangleIcon(props: SVGProps<SVGSVGElement>) {
        return (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4.5m0 3h.008m-8.257 3.371h16.498c1.55 0 2.514-1.683 1.732-3.037L13.732 4.29c-.775-1.323-2.689-1.323-3.464 0L2.018 16.834c-.782 1.354.182 3.037 1.732 3.037Z" />
            </svg>
        );
    }

    return (<section className="rounded-[32px] border border-rose-200 bg-white p-10 text-center shadow-[0_24px_60px_-42px_rgba(225,29,72,0.25)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <ExclamationTriangleIcon className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-slate-950">
            Không có khóa học nào vui lòng liên hệ quản trị viên để được hỗ trợ
        </h2>
        {  props.children && <p className="mt-3 text-sm leading-6 text-slate-500">{props.children}</p>}
    </section>);
}
