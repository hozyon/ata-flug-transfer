import { useState, useRef, useCallback } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

interface UseSwipeActionReturn {
  swipeOffset: number;
  isRevealed: boolean;
  handlers: SwipeHandlers;
  close: () => void;
}

const THRESHOLD = 80;
const MAX_OFFSET = 160;

export function useSwipeAction(onSwipeOpen?: () => void): UseSwipeActionReturn {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentOffset = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentOffset.current = isRevealed ? -THRESHOLD : 0;
    isHorizontal.current = null;
  }, [isRevealed]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    // Determine direction on first significant move
    if (isHorizontal.current === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontal.current = Math.abs(dx) > Math.abs(dy);
      }
      return;
    }

    if (!isHorizontal.current) return;

    e.preventDefault();
    const newOffset = Math.min(0, Math.max(-MAX_OFFSET, currentOffset.current + dx));
    setSwipeOffset(newOffset);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (swipeOffset < -THRESHOLD) {
      setSwipeOffset(-THRESHOLD);
      setIsRevealed(true);
      onSwipeOpen?.();
    } else {
      setSwipeOffset(0);
      setIsRevealed(false);
    }
    isHorizontal.current = null;
  }, [swipeOffset, onSwipeOpen]);

  const close = useCallback(() => {
    setSwipeOffset(0);
    setIsRevealed(false);
  }, []);

  return {
    swipeOffset,
    isRevealed,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    close,
  };
}
