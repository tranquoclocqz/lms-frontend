"use client";

import { StudentShell } from "@/components/StudentShell";
import type { ICourse } from "@/typing/Courses";
import Link from "next/link";
import type { SVGProps } from "react";
import { useState } from "react";
import CourseGridSection from "./CourseGridSection";

type StudentCourseCatalogProps = {
  initialCourses?: ICourse[];
  initialError?: string | null;
  isRefreshing?: boolean;
  onRetry?: () => void;
  pageTitle?: string;
  pageDescription?: string;
  activeHref?: string;
  layoutVariant?: "discover" | "catalog";
};


const discoverCategoryPills = [
  { label: "AI Product Manager", query: "AI" },
  { label: "Product Manager", query: "Development" },
  { label: "Business Analyst", query: "Business" },
  { label: "UIUX", query: "Design" },
  { label: "AI Tools", query: "Data" },
] as const;

export function StudentCourseCatalog({
  initialCourses = [],
  initialError = null,
  pageTitle = "Khám phá thư viện khóa học BrainCourse",
  pageDescription = "Tìm khóa học phù hợp, xem chi tiết và mua hoặc vào học ngay khi đã có quyền truy cập.",
  activeHref = "/",
  layoutVariant = "catalog",
}: StudentCourseCatalogProps) {

  const [search, setSearch] = useState("");
  const error = initialError || "";

  return (
    <StudentShell
      title={pageTitle}
      description={pageDescription}
      activeHref={activeHref}
      hideHero
      contentWidth="wide"
      search={{
        value: search,
        onChange: setSearch,
        placeholder: "Tìm theo tên khóa học, mô tả, danh mục, giảng viên...",
      }}
    >
      {layoutVariant === "discover" ? (
        <>
          <KnowledgeNetworkHero />
          <CategoryPillSection search={search} onSelect={setSearch} />

          {error ? (
            <section className="rounded-[32px] border border-rose-200 bg-white p-10 text-center shadow-[0_24px_60px_-42px_rgba(225,29,72,0.25)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <ExclamationTriangleIcon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">
                Không thể tải danh sách khóa học
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
            </section>
          ) : (
            <>
              <CourseGridSection
                eyebrow="Khóa học nổi bật"
                title="Khóa học nổi bật"
                description="Những khóa học được học viên quan tâm nhiều nhất."
                courses={initialCourses}
              />

              <CourseGridSection
                eyebrow="Khóa học mới"
                title="Nội dung mới được cập nhật"
                description="Bắt đầu với những khóa học vừa xuất hiện gần đây trong thư viện."
                courses={initialCourses}
              />
            </>
          )}
        </>
      ) : (
        <>

        </>
      )}
    </StudentShell>
  );
}


function KnowledgeNetworkHero() {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-sky-200/55 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#38bdf8_100%)] px-6 py-8 text-white shadow-[0_36px_90px_-44px_rgba(29,78,216,0.5)] sm:px-8 sm:py-9 lg:min-h-[360px] lg:px-10 lg:py-10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(125,211,252,0.28),transparent_24%),radial-gradient(circle_at_55%_100%,rgba(59,130,246,0.2),transparent_28%)]" />
        <div className="absolute -left-10 top-10 h-48 w-48 rounded-full bg-cyan-300/16 blur-3xl" />
        <div className="absolute right-8 top-6 h-44 w-44 rounded-full bg-sky-200/18 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-52 w-52 rounded-full bg-blue-400/16 blur-3xl" />
      </div>

      <div className="relative grid gap-8 lg:min-h-[280px] lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,1.08fr)] lg:items-center">
        <div className="max-w-2xl">
          <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.035em] text-white sm:text-[2.9rem] sm:leading-[1.05]">
            Học kỹ năng cho PM thời đại AI
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-[1rem]">
            Khám phá AI Product Management, Business Analysis, UIUX và các kỹ
            năng giúp bạn xây dựng sản phẩm trong thời đại AI.
          </p>
          <div className="mt-7">
            <Link
              href="/student/courses"
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-50"
            >
              Khám phá khóa học
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <KnowledgeNetworkGraphic />
        </div>
      </div>
    </section>
  );
}

function KnowledgeNetworkGraphic() {
  return (
    <div className="relative mx-auto h-[320px] w-full max-w-[560px]">
      <svg
        viewBox="0 0 560 320"
        className="h-full w-full drop-shadow-[0_34px_70px_rgba(14,165,233,0.18)]"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="network-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(147,197,253,1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="55%" stopColor="rgba(125,211,252,0.88)" />
            <stop offset="100%" stopColor="rgba(125,211,252,0)" />
          </radialGradient>
          <filter id="soft-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="13" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity="0.75">
          <path d="M104 172C165 145 213 126 258 110C316 89 383 87 446 108" stroke="url(#network-line)" strokeWidth="2.6">
            <animate attributeName="stroke-dasharray" values="0 290;120 170;0 290" dur="10s" repeatCount="indefinite" />
          </path>
          <path d="M104 172C171 188 220 214 279 223C345 232 421 208 474 173" stroke="url(#network-line)" strokeWidth="2.6">
            <animate attributeName="stroke-dasharray" values="0 310;125 185;0 310" dur="11s" repeatCount="indefinite" />
          </path>
          <path d="M258 110C264 148 272 181 279 223" stroke="url(#network-line)" strokeWidth="2.6">
            <animate attributeName="stroke-dasharray" values="0 145;80 65;0 145" dur="8.5s" repeatCount="indefinite" />
          </path>
          <path d="M446 108C465 125 472 147 474 173" stroke="url(#network-line)" strokeWidth="2.6">
            <animate attributeName="stroke-dasharray" values="0 120;66 54;0 120" dur="8s" repeatCount="indefinite" />
          </path>
        </g>

        <g filter="url(#soft-glow)">
          <circle cx="104" cy="172" r="39" fill="rgba(255,255,255,0.08)" />
          <circle cx="258" cy="110" r="34" fill="rgba(255,255,255,0.08)" />
          <circle cx="279" cy="223" r="31" fill="rgba(255,255,255,0.08)" />
          <circle cx="446" cy="108" r="42" fill="rgba(255,255,255,0.08)" />
          <circle cx="474" cy="173" r="34" fill="rgba(255,255,255,0.08)" />
        </g>

        <g>
          <NetworkNode x={104} y={172} label="AI" delay="0s" />
          <NetworkNode x={258} y={110} label="Product" delay="1.1s" />
          <NetworkNode x={279} y={223} label="BA" delay="0.5s" />
          <NetworkNode x={446} y={108} label="UIUX" delay="1.8s" />
          <NetworkNode x={474} y={173} label="Growth" delay="0.9s" />
        </g>

        <g opacity="0.75">
          <circle cx="104" cy="172" r="60" fill="url(#node-glow)">
            <animate attributeName="opacity" values="0.36;0.66;0.36" dur="7s" begin="0s" repeatCount="indefinite" />
          </circle>
          <circle cx="446" cy="108" r="64" fill="url(#node-glow)">
            <animate attributeName="opacity" values="0.28;0.52;0.28" dur="8.5s" begin="1s" repeatCount="indefinite" />
          </circle>
        </g>

        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="translate"
          values="0 0; 0 -4; 0 0; 0 5; 0 0"
          dur="11s"
          repeatCount="indefinite"
        />
      </svg>
    </div>
  );
}

function NetworkNode({
  x,
  y,
  label,
  delay,
}: {
  x: number;
  y: number;
  label: string;
  delay: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="22.5" fill="rgba(255,255,255,0.12)">
        <animate attributeName="r" values="21.5;23.2;21.5" dur="6.5s" begin={delay} repeatCount="indefinite" />
      </circle>
      <circle r="5.5" fill="white">
        <animate attributeName="opacity" values="0.88;1;0.88" dur="4.8s" begin={delay} repeatCount="indefinite" />
      </circle>
      <text
        x="0"
        y="45"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="600"
        opacity="0.96"
      >
        {label}
      </text>
    </g>
  );
}

function CategoryPillSection({
  search,
  onSelect,
}: {
  search: string;
  onSelect: (value: string) => void;
}) {
  return (
    <section className="-mt-1 overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2.5">
        {discoverCategoryPills.map((item) => {
          const isActive = search.trim().toLowerCase() === item.query.toLowerCase();

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(isActive ? "" : item.query)}
              className={`inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium transition ${isActive
                ? "border-blue-200 bg-blue-600 text-white shadow-[0_16px_28px_-20px_rgba(37,99,235,0.7)]"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}


function ExclamationTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4.5m0 3h.008m-8.257 3.371h16.498c1.55 0 2.514-1.683 1.732-3.037L13.732 4.29c-.775-1.323-2.689-1.323-3.464 0L2.018 16.834c-.782 1.354.182 3.037 1.732 3.037Z" />
    </svg>
  );
}
