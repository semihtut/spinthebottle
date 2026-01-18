import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main
      className="flex-1 flex flex-col items-center justify-center p-6 gap-8 safe-top safe-bottom"
      role="main"
      aria-label="Home"
    >
      {/* Logo / Title */}
      <header className="text-center animate-fade-in">
        <h1 className="font-display text-4xl font-bold text-text mb-2">
          Spin the Bottle
        </h1>
        <p className="text-text-muted text-lg">Truth or Dare</p>
      </header>

      {/* Animated bottle illustration */}
      <div
        className="w-32 h-48 flex items-center justify-center animate-bounce-in"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 64 128"
          className="w-16 h-32 drop-shadow-lg"
          fill="none"
        >
          {/* Bottle neck */}
          <rect
            x="24"
            y="0"
            width="16"
            height="24"
            rx="4"
            className="fill-emerald-400/80"
          />
          {/* Bottle body */}
          <ellipse
            cx="32"
            cy="76"
            rx="28"
            ry="48"
            className="fill-emerald-500/70"
          />
          {/* Highlight */}
          <ellipse
            cx="20"
            cy="68"
            rx="6"
            ry="20"
            className="fill-white/20"
          />
        </svg>
      </div>

      {/* Action buttons */}
      <nav
        className="flex flex-col gap-4 w-full max-w-xs animate-slide-up"
        aria-label="Main navigation"
      >
        <Link
          to="/setup"
          className="glass glass-hover flex items-center justify-center py-4 px-6 rounded-lg text-lg font-semibold text-text transition-all active:scale-95 touch-feedback focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          aria-label="Start a new game"
        >
          Play
        </Link>

        <Link
          to="/packs"
          className="glass glass-hover flex items-center justify-center py-3 px-6 rounded-md text-text-muted transition-all active:scale-95 touch-feedback focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          aria-label="Manage prompt packs"
        >
          Packs
        </Link>

        <Link
          to="/settings"
          className="glass glass-hover flex items-center justify-center py-3 px-6 rounded-md text-text-muted transition-all active:scale-95 touch-feedback focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          aria-label="App settings"
        >
          Settings
        </Link>
      </nav>

      {/* Version info */}
      <footer className="text-text-muted text-xs opacity-50">
        <span aria-label="Version 1.0.0">v1.0.0</span>
      </footer>
    </main>
  );
}
