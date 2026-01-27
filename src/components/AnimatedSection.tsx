'use client';

import { motion, useAnimation, HTMLMotionProps } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import React from 'react';

// Используем HTMLMotionProps от framer-motion. 
// Это решает конфликт типов, так как этот тип уже включает все HTML-атрибуты
// с правильными, совместимыми с анимацией определениями событий (например, onDrag).
interface Props extends HTMLMotionProps<'section'> {
  delay?: number;
}

export const AnimatedSection = ({ children, delay = 0, ...props }: Props) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: 'easeOut' },
        },
      }}
      // Передаем все остальные пропсы (id, className, style и т.д.),
      // которые теперь полностью совместимы по типам.
      {...props}
    >
      {children}
    </motion.section>
  );
};
