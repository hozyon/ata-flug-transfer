import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    format?: (val: number) => string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 800, format }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = displayValue;
        const endValue = value;

        if (startValue === endValue) return;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function: easeOutExpo
            const easing = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
            const currentVal = startValue + (endValue - startValue) * easing;

            setDisplayValue(currentVal);

            if (percentage < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
            }
        };

        const reqId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(reqId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, duration]); // displayValue intentionally excluded — adding it would restart animation on each frame

    return <>{format ? format(displayValue) : Math.round(displayValue)}</>;
};
