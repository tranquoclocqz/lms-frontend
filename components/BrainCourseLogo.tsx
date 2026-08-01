import type { SVGProps } from "react";

type BrainCourseLogoProps = {
  compact?: boolean;
};

export function BrainCourseLogo({ compact = false }: BrainCourseLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#2563eb_48%,#38bdf8_100%)] shadow-[0_18px_45px_-24px_rgba(79,70,229,0.6)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_40%)]" />
        <BookSparkIcon className="relative h-6 w-6 text-white" />
      </div>

      {!compact ? (
        <div className="min-w-0">
          <p className="text-base font-semibold tracking-tight text-slate-950">
            BrainCourse
          </p>
          <p className="text-xs text-slate-500">Learning, progress, mastery</p>
        </div>
      ) : null}
    </div>
  );
}

function BookSparkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 6.75A2.25 2.25 0 0 1 7.5 4.5h9A2.25 2.25 0 0 1 18.75 6.75v10.5A2.25 2.25 0 0 0 16.5 15H7.5a2.25 2.25 0 0 0-2.25 2.25V6.75Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 4.5v10.5A2.25 2.25 0 0 1 9.75 12.75h9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.5 3.75.375 1.125L18 5.25l-1.125.375L16.5 6.75l-.375-1.125L15 5.25l1.125-.375L16.5 3.75Z"
      />
    </svg>
  );
}
