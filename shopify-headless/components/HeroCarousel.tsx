'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './HeroCarousel.module.css';

interface HeroImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

const HeroCarouselComponent: React.FC<{ images: HeroImage[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const slideVariants = useMemo(() => ({
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }), []);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length);
  }, [images.length]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  return (
    <section className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'tween', duration: 0.4, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
            className={styles.slide}
          >
            <div className={styles.imageWrapper}>
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                priority={currentIndex === 0}
                quality={85}
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect fill='%23f0f0f0'/%3E%3C/svg%3E"
                className={styles.image}
                sizes="100vw"
                loading={currentIndex === 0 ? 'eager' : 'lazy'}
              />
              {/* Overlay with gradient */}
              <div className={styles.overlay} />

              {/* Text overlay - bottom left */}
              <motion.div
                className={styles.textOverlay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.3 }}
              >
                <h2 className={styles.overlayTitle}>{images[currentIndex].title}</h2>
                <p className={styles.overlayDescription}>{images[currentIndex].description}</p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className={styles.dotsContainer}>
          {images.map((_, index) => (
            <motion.button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.85 }}
              aria-label={`Go to slide ${index + 1}`}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>

        {/* Previous/Next buttons - simplified animations for performance */}
        <motion.button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
          transition={{ duration: 0.1 }}
        >
          ←
        </motion.button>
        <motion.button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
          transition={{ duration: 0.1 }}
        >
          →
        </motion.button>
      </div>
    </section>
  );
};

export const HeroCarousel = HeroCarouselComponent;
