export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function StyleCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-[18px] border border-[#EADBCE] bg-[#FAF7F2] p-2 sm:rounded-[24px] sm:p-3.5">
      <Skeleton className="aspect-[4/3.7] w-full rounded-[18px]" />
      <Skeleton className="mt-4 h-6 w-3/4 rounded-md" />
      <Skeleton className="mt-2 h-3 w-full rounded-md" />
      <Skeleton className="mt-2 h-3 w-2/3 rounded-md" />
      <Skeleton className="mt-4 h-10 w-full rounded-2xl" />
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F1EA]" aria-busy="true" aria-label="Loading page">
      <div className="relative min-h-[72vh] overflow-hidden bg-[#171211]">
        <Skeleton className="skeleton-dark absolute inset-0 rounded-none" />
        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-6 py-20 md:px-12">
          <Skeleton className="skeleton-dark h-3 w-40 rounded-full" />
          <Skeleton className="skeleton-dark mt-6 h-14 w-[min(100%,28rem)] rounded-lg" />
          <Skeleton className="skeleton-dark mt-3 h-14 w-[min(90%,22rem)] rounded-lg" />
          <Skeleton className="skeleton-dark mt-6 h-4 w-[min(100%,20rem)] rounded-md" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="skeleton-dark h-12 w-40 rounded-full" />
            <Skeleton className="skeleton-dark h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:px-10">
        <Skeleton className="mx-auto h-3 w-48 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-10 w-72 rounded-lg" />
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Skeleton className="h-[320px] rounded-3xl" />
          <Skeleton className="h-[320px] rounded-3xl" />
        </div>
        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <StyleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StylesPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F1EA]" aria-busy="true" aria-label="Loading styles">
      <div className="grid gap-8 px-5 py-10 md:px-10 lg:grid-cols-2 lg:min-h-[420px]">
        <div className="flex flex-col justify-center">
          <Skeleton className="h-3 w-40 rounded-full" />
          <Skeleton className="mt-6 h-16 w-3/4 rounded-lg" />
          <Skeleton className="mt-4 h-4 w-1/2 rounded-md" />
          <Skeleton className="mt-8 h-12 w-44 rounded-full" />
        </div>
        <Skeleton className="h-[280px] rounded-[12rem_0_0_12rem] lg:h-full" />
      </div>
      <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 md:px-10">
        <Skeleton className="h-12 w-full rounded-full" />
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 md:px-10">
        <div className="mt-8 flex gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-20 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <StyleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StyleDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:px-10 md:py-12" aria-busy="true" aria-label="Loading style">
      <Skeleton className="h-3 w-40 rounded-full" />
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
        <Skeleton className="mx-auto aspect-[4/5] w-full max-w-[260px] rounded-[22px] lg:col-span-4 lg:max-w-none" />
        <div className="lg:col-span-8">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="mt-4 h-12 w-2/3 rounded-lg" />
          <Skeleton className="mt-4 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
          <div className="mt-6 grid max-w-lg grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
          <div className="mt-6 flex gap-3">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContentPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F1EA]" aria-busy="true" aria-label="Loading page">
      <div className="bg-[#171211] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="skeleton-dark h-3 w-28 rounded-full" />
          <Skeleton className="skeleton-dark mt-6 h-16 w-[min(100%,26rem)] rounded-lg" />
          <Skeleton className="skeleton-dark mt-4 h-4 w-[min(100%,20rem)] rounded-md" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 md:px-10 lg:grid-cols-2">
        <Skeleton className="h-[420px] rounded-[32px]" />
        <div>
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="mt-4 h-10 w-3/4 rounded-lg" />
          <Skeleton className="mt-5 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
          <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
