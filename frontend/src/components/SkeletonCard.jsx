import React from "react";

export const SkeletonCard = () => {
  return (
    <div className="glass-panel rounded-3xl p-5 space-y-4 border border-slate-800/80 overflow-hidden relative">
      {/* Image Skeleton */}
      <div className="w-full h-48 rounded-2xl skeleton-shimmer" />

      {/* Title & Badge */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 flex-1">
          <div className="w-24 h-4 rounded-md skeleton-shimmer" />
          <div className="w-40 h-6 rounded-md skeleton-shimmer" />
        </div>
        <div className="w-16 h-6 rounded-full skeleton-shimmer" />
      </div>

      {/* Specs Grid Skeleton */}
      <div className="grid grid-cols-3 gap-2 py-2">
        <div className="h-10 rounded-xl skeleton-shimmer" />
        <div className="h-10 rounded-xl skeleton-shimmer" />
        <div className="h-10 rounded-xl skeleton-shimmer" />
      </div>

      {/* Footer Price & Button Skeleton */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
        <div className="w-28 h-7 rounded-lg skeleton-shimmer" />
        <div className="w-24 h-9 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 w-full rounded-2xl skeleton-shimmer border border-slate-800/40" />
      ))}
    </div>
  );
};

export default SkeletonCard;
