import { useState, useRef, useCallback } from 'react';
import { haptic } from '../utils/haptic';

interface PullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
}

const THRESHOLD = 80;
const MAX_PULL = 120;
const REFRESH_DURATION = 1200;

export function usePullToRefresh(
  onRefresh: () => void,
  scrollContainerRef: React.RefObject<HTMLElement | null>
): PullToRefreshReturn {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    const scrollTop = scrollContainerRef.current?.scrollTop ?? 0;
    if (scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, [isRefreshing, scrollContainerRef]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;
    const scrollTop = scrollContainerRef.current?.scrollTop ?? 0;
    if (scrollTop > 0) {
      isPulling.current = false;
      setPullDistance(0);
      return;
    }
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      if (e.cancelable) e.preventDefault(); // Prevent native pull-to-refresh
      // Rubber-band effect
      const distance = Math.min(MAX_PULL, dy * 0.4);
      setPullDistance(distance);
    }
  }, [isRefreshing, scrollContainerRef]);


  const onTouchEnd = useCallback(() => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= THRESHOLD) {
      haptic.success();
      setIsRefreshing(true);
      setPullDistance(THRESHOLD * 0.6);
      onRefresh();
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, REFRESH_DURATION);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
