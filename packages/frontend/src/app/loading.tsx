export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Shimmer keyframes are inlined via style tag */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.03) 25%,
            rgba(168, 85, 247, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Glass card skeleton */}
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 space-y-6">
        {/* Title bar */}
        <div className="h-8 w-3/4 rounded-lg skeleton-shimmer" />

        {/* Subtitle */}
        <div className="h-5 w-1/2 rounded-lg skeleton-shimmer" />

        {/* Content lines */}
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full rounded skeleton-shimmer" />
          <div className="h-4 w-5/6 rounded skeleton-shimmer" />
          <div className="h-4 w-4/6 rounded skeleton-shimmer" />
        </div>

        {/* Button placeholder */}
        <div className="pt-4">
          <div className="h-12 w-40 rounded-full skeleton-shimmer" />
        </div>
      </div>

      {/* Pulsing text */}
      <p className="mt-8 text-sm text-white/30 animate-pulse">Wird geladen...</p>
    </div>
  );
}
