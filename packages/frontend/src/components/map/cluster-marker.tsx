'use client';

import { motion } from 'framer-motion';

interface ClusterMarkerProps {
  readonly count: number;
  readonly onClick: () => void;
}

function getSize(count: number): number {
  if (count >= 50) return 52;
  if (count >= 10) return 44;
  return 36;
}

export function ClusterMarker({ count, onClick }: ClusterMarkerProps) {
  const size = getSize(count);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {/* Pulsing glow ring */}
      <div
        className="absolute inset-[-4px] rounded-full"
        style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          animation: 'cluster-pulse 2s ease-out infinite',
          opacity: 0.35,
        }}
      />

      {/* Main circle */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center border-2 border-white/30"
        style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          boxShadow: '0 0 16px rgba(168, 85, 247, 0.6)',
        }}
      >
        <span className="text-white font-bold text-sm leading-none select-none">
          {count}
        </span>
      </div>
    </motion.div>
  );
}
