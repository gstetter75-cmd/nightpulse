'use client';

interface AnimatedGradientProps {
  readonly colors?: readonly string[];
  readonly speed?: number;
  readonly className?: string;
  readonly asText?: boolean;
}

export function AnimatedGradient({
  colors = ['#a855f7', '#ec4899', '#3b82f6', '#06b6d4'],
  speed = 6,
  className = '',
  asText = false,
}: AnimatedGradientProps) {
  const gradient = `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`;

  if (asText) {
    return (
      <span
        className={`inline-block ${className}`}
        style={{
          background: gradient,
          backgroundSize: '300% 300%',
          animation: `gradient-shift ${speed}s ease infinite`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      />
    );
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: gradient,
        backgroundSize: '300% 300%',
        animation: `gradient-shift ${speed}s ease infinite`,
      }}
    />
  );
}
