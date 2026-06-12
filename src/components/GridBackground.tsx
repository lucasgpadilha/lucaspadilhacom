export default function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(99, 102, 241, 0.06)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern id="grid-large" width="180" height="180" patternUnits="userSpaceOnUse">
            <path
              d="M 180 0 L 0 0 0 180"
              fill="none"
              stroke="rgba(99, 102, 241, 0.04)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.08)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#grid-large)" />
        <rect width="100%" height="120" fill="url(#scanGrad)" className="animate-scan" />
      </svg>
    </div>
  );
}
