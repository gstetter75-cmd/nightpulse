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
];

const BLOB_CONFIGS = [
  { top: '10%', left: '15%', size: '40vw', duration: '20s', delay: '0s' },
  { top: '60%', left: '60%', size: '35vw', duration: '25s', delay: '-5s' },
  { top: '30%', left: '70%', size: '30vw', duration: '22s', delay: '-10s' },
  { top: '70%', left: '20%', size: '45vw', duration: '28s', delay: '-15s' },
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
            filter: 'blur(80px)',
            animation: `aurora ${config.duration} ease-in-out infinite`,
            animationDelay: config.delay,
          }}
        />
      ))}
    </div>
  );
}
