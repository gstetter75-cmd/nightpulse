'use client';

interface GradientMeshProps {
  readonly className?: string;
  readonly opacity?: number;
  readonly colors?: readonly string[];
}

const DEFAULT_COLORS = [
  'rgba(168, 85, 247, 1)',
  'rgba(236, 72, 153, 1)',
  'rgba(59, 130, 246, 1)',
  'rgba(6, 182, 212, 1)',
  'rgba(20, 184, 166, 1)',
];

const BLOB_CONFIGS = [
  { top: '5%', left: '10%', size: '50vw', duration: '20s', delay: '0s', pulseDelay: '0s' },
  { top: '55%', left: '55%', size: '45vw', duration: '25s', delay: '-5s', pulseDelay: '-2s' },
  { top: '25%', left: '65%', size: '40vw', duration: '22s', delay: '-10s', pulseDelay: '-4s' },
  { top: '65%', left: '15%', size: '55vw', duration: '28s', delay: '-15s', pulseDelay: '-6s' },
  { top: '40%', left: '40%', size: '35vw', duration: '24s', delay: '-8s', pulseDelay: '-3s' },
];

export function GradientMesh({
  className = '',
  opacity = 0.3,
  colors = DEFAULT_COLORS,
}: GradientMeshProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {BLOB_CONFIGS.map((config, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: config.top,
            left: config.left,
            width: config.size,
            height: config.size,
            background: `radial-gradient(circle, ${colors[i % colors.length]} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            animation: `aurora ${config.duration} ease-in-out infinite, blob-pulse 8s ease-in-out infinite`,
            animationDelay: `${config.delay}, ${config.pulseDelay}`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes blob-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
