export default function Loading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_28%,#f8fafc_100%)] text-slate-950">
      <section className="border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(186,230,253,0.55),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_18%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:px-8 lg:py-16">
          <div className="space-y-5">
            <div className="h-8 w-44 animate-pulse rounded-full bg-white" />
            <div className="h-14 w-4/5 animate-pulse rounded-2xl bg-white/80" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/80" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-white/80" />
          </div>
          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-[24px] bg-white/80 shadow-sm"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_38px_-28px_rgba(15,23,42,0.24)]"
            >
              <div className="aspect-video animate-pulse bg-slate-200" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-28 animate-pulse rounded-full bg-slate-200" />
                <div className="h-6 w-5/6 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-10 w-full animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
