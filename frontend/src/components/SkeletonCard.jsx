const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-3 shadow-sm">
      <div className="h-52 w-full animate-pulse rounded-xl bg-slate-800 sm:h-56"></div>
      <div className="mt-4 space-y-3 px-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800"></div>
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800"></div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 w-24 animate-pulse rounded-full bg-slate-800"></div>
          <div className="h-8 w-32 animate-pulse rounded-full bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
