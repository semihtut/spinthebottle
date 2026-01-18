import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = memo(function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-glass-bg animate-pulse';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
});

// Pre-built skeleton components for common use cases
export const SkeletonText = memo(function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 && lines > 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  );
});

export const SkeletonCard = memo(function SkeletonCard({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={`glass rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" height={16} width="60%" className="mb-2" />
          <Skeleton variant="text" height={12} width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
});

export const SkeletonButton = memo(function SkeletonButton({
  className = '',
  width = 100,
}: {
  className?: string;
  width?: number | string;
}) {
  return (
    <Skeleton
      variant="rectangular"
      height={40}
      width={width}
      className={`rounded-lg ${className}`}
    />
  );
});
