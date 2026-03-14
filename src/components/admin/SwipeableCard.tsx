import React from 'react';
import { useSwipeAction } from '../../hooks/useSwipeAction';
import { haptic } from '../../utils/haptic';

interface SwipeAction {
  icon: string;
  label: string;
  color: string; // tailwind bg class
  onClick: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  actions: SwipeAction[];
  onClick?: () => void;
  className?: string;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ children, actions, onClick, className = '' }) => {
  const { swipeOffset, isRevealed, handlers, close } = useSwipeAction(() => haptic.swipe());

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 group cursor-pointer ${className}`}
      onPointerEnter={() => haptic.tap()}
    >
      {/* Revealed Actions (behind the card) */}
      <div className="absolute right-0 top-0 bottom-0 flex items-stretch z-0">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              haptic.tap();
              close();
            }}
            className={`w-20 flex flex-col items-center justify-center gap-1 ${action.color} text-white transition-opacity ${swipeOffset === 0 && !isRevealed ? 'opacity-0' : 'opacity-100'}`}
            style={{ transform: `translateX(${Math.max(0, swipeOffset + 80 * (actions.length))}px)` }}
          >
            <i className={`fa-solid ${action.icon} text-sm`}></i>
            <span className="text-[9px] font-bold">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Card Content (slides left) */}
      <div
        {...handlers}
        onClick={!isRevealed ? onClick : () => close()}
        className="relative z-10 bg-[var(--color-dark)] sm:bg-transparent bg-opacity-10 border border-white/[0.06] rounded-2xl transition-transform duration-200 ease-out h-full"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        {/* Solid background for mobile to hide actions, transparent for desktop */}
        <div className="absolute inset-0 bg-[var(--color-dark)] sm:bg-transparent rounded-2xl -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-white/[0.03] rounded-2xl -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
        {children}
      </div>
    </div>
  );
};
