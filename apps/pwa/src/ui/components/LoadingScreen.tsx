import { memo } from 'react';

export const LoadingScreen = memo(function LoadingScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Animated bottle icon */}
        <div className="relative">
          <svg
            viewBox="0 0 64 64"
            className="w-16 h-16 text-primary animate-pulse-soft"
            fill="currentColor"
          >
            {/* Bottle neck */}
            <rect x="26" y="8" width="12" height="12" rx="2" opacity="0.8" />
            {/* Bottle body */}
            <ellipse cx="32" cy="40" rx="16" ry="20" opacity="0.6" />
            {/* Shine */}
            <ellipse cx="24" cy="36" rx="3" ry="8" fill="white" opacity="0.2" />
          </svg>
          {/* Spinning indicator around bottle */}
          <div className="absolute inset-0 w-16 h-16">
            <div className="w-full h-full border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-display font-bold text-lg text-text">Spin the Bottle</h1>
          <p className="text-text-muted text-sm mt-1">Loading...</p>
        </div>
      </div>
    </div>
  );
});
