import { useCallback, useRef, useState } from 'react';

interface LongPressOptions {
    shouldPreventDefault?: boolean;
    delay?: number;
}

type AnyEvent = MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent;

export const useLongPress = (
    onLongPress: (e: AnyEvent) => void,
    onClick?: (e: AnyEvent) => void,
    { shouldPreventDefault = true, delay = 500 }: LongPressOptions = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const target = useRef<EventTarget | null>(null);

    const start = useCallback(
        (event: AnyEvent) => {
            if (shouldPreventDefault && event.target) {
                event.target.addEventListener('touchend', preventDefault as EventListener, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event: AnyEvent, shouldTriggerClick = true) => {
            if (timeout.current) clearTimeout(timeout.current);
            if (shouldTriggerClick && !longPressTriggered && onClick) onClick(event);
            setLongPressTriggered(false);
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener('touchend', preventDefault as EventListener);
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        onMouseDown: (e: React.MouseEvent) => start(e),
        onTouchStart: (e: React.TouchEvent) => start(e),
        onMouseUp: (e: React.MouseEvent) => clear(e),
        onMouseLeave: (e: React.MouseEvent) => clear(e, false),
        onTouchEnd: (e: React.TouchEvent) => clear(e)
    };
};

const preventDefault = (event: Event) => {
    if (!('touches' in event)) return;

    if ((event as TouchEvent).touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};
