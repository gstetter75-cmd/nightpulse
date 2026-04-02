'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

type Mode = 'fade-in' | 'slide-up' | 'blur-in';

interface AnimatedTextProps {
  readonly text: string;
  readonly className?: string;
  readonly mode?: Mode;
  readonly gradient?: boolean;
  readonly delay?: number;
  readonly as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MODE_VARIANTS: Record<Mode, { hidden: any; visible: any }> = {
  'fade-in': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  'blur-in': {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
};

export function AnimatedText({
  text,
  className = '',
  mode = 'slide-up',
  gradient = false,
  delay = 0,
  as: Tag = 'h2',
}: AnimatedTextProps) {
  const characters = useMemo(() => text.split(''), [text]);
  const variant = MODE_VARIANTS[mode];

  const gradientClass = gradient ? 'gradient-text' : '';

  return (
    <Tag className={`${gradientClass} ${className}`}>
      <motion.span
        className="inline-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.03, delayChildren: delay } },
        }}
      >
        {characters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            style={char === ' ' ? { width: '0.3em' } : undefined}
            variants={{
              hidden: variant.hidden,
              visible: {
                ...variant.visible,
                transition: { duration: 0.4, ease: 'easeOut' },
              },
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
