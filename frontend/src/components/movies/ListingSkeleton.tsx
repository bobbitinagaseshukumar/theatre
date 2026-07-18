import React from "react";
import { Skeleton } from "../ui";

/**
 * Skeleton grid shown while movies load (shimmer via .cpm-skeleton).
 */
const ListingSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col overflow-hidden rounded-cpm border border-cpm-border bg-cpm-surface">
        <Skeleton className="aspect-[2/3] w-full rounded-none" />
        <div className="space-y-2 p-4">
          <Skeleton variant="line" className="w-3/4" />
          <Skeleton variant="line" className="w-1/2" />
          <div className="pt-3">
            <Skeleton variant="line" className="w-1/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ListingSkeleton;
