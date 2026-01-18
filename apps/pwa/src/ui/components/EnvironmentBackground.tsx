import { memo } from 'react';
import type { Environment } from '@/domain';

interface EnvironmentBackgroundProps {
  environment: Environment;
  className?: string;
}

/**
 * Renders the environment background with:
 * - Background color/gradient (CSS fallback)
 * - Background image when available
 * - Color grading overlay
 * - Subtle ambient particles (optional)
 */
export const EnvironmentBackground = memo(function EnvironmentBackground({
  environment,
  className = '',
}: EnvironmentBackgroundProps) {
  // Generate gradient based on environment
  const getGradient = () => {
    switch (environment.id) {
      case 'desktop':
        return 'radial-gradient(ellipse at 50% 30%, hsl(30, 30%, 15%) 0%, hsl(30, 20%, 8%) 100%)';
      case 'lounge':
        return 'radial-gradient(ellipse at 50% 40%, hsl(15, 40%, 12%) 0%, hsl(15, 30%, 6%) 100%)';
      case 'rooftop':
        return 'radial-gradient(ellipse at 50% 70%, hsl(220, 30%, 12%) 0%, hsl(220, 20%, 5%) 100%)';
      default:
        return 'radial-gradient(ellipse at 50% 50%, hsl(0, 0%, 12%) 0%, hsl(0, 0%, 6%) 100%)';
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: getGradient() }}
      />

      {/* Background image - loads lazily */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${environment.backgroundAsset})`,
        }}
      />

      {/* Color grading overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{ backgroundColor: environment.colorGrading.tint }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Ambient particles for specific environments */}
      {environment.id === 'rooftop' && <CityLights />}
      {environment.id === 'lounge' && <WarmGlow />}
    </div>
  );
});

// City lights effect for rooftop
function CityLights() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Bokeh lights */}
      <div className="absolute bottom-[20%] left-[10%] w-2 h-2 rounded-full bg-amber-300/20 blur-sm animate-pulse" />
      <div
        className="absolute bottom-[25%] left-[25%] w-3 h-3 rounded-full bg-blue-300/15 blur-md animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute bottom-[18%] right-[20%] w-2 h-2 rounded-full bg-white/10 blur-sm animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div
        className="absolute bottom-[30%] right-[35%] w-1.5 h-1.5 rounded-full bg-amber-200/20 blur-sm animate-pulse"
        style={{ animationDelay: '1.5s' }}
      />
      <div
        className="absolute bottom-[22%] left-[45%] w-2 h-2 rounded-full bg-cyan-300/15 blur-md animate-pulse"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
}

// Warm glow effect for lounge
function WarmGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Warm lamp glow */}
      <div
        className="absolute top-[15%] right-[15%] w-32 h-32 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,180,100,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full blur-2xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,150,80,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
