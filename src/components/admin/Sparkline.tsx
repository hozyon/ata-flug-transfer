import React from 'react';

interface SparklineProps {
    data: number[];
    color: string;
    width?: number;
    height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, width = 100, height = 30 }) => {
    if (!data || data.length === 0) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width="100%" height="100%" viewBox={`0 -5 ${width} ${height + 10}`} preserveAspectRatio="none" className="overflow-visible">
            <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-${color} drop-shadow-[0_2px_4px_rgba(var(--tw-colors-${color}),0.5)]`}
            />
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={`url(#gradient-${color})`}
                className={`text-${color}`}
            />
        </svg>
    );
};
