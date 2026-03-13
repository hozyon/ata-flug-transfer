const canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

export const haptic = {
  /** Light tap — 10ms */
  tap: () => { if (canVibrate) navigator.vibrate(10); },
  /** Success — double pulse */
  success: () => { if (canVibrate) navigator.vibrate([10, 50, 20]); },
  /** Error / destructive — strong single */
  error: () => { if (canVibrate) navigator.vibrate([30, 40, 30]); },
  /** Swipe reveal */
  swipe: () => { if (canVibrate) navigator.vibrate(5); },
};
