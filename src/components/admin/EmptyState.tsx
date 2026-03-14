import React from 'react';

interface EmptyStateProps {
    icon: string;
    title: string;
    description?: string;
    action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-t border-white/[0.04]">
        <i className={`fa-solid ${icon} text-6xl text-white block mb-4`} style={{ opacity: 0.08 }}></i>
        <p className="text-slate-400 text-sm font-semibold">{title}</p>
        {description && <p className="text-slate-600 text-xs mt-1.5">{description}</p>}
        {action && (
            <button
                onClick={action.onClick}
                className="mt-5 px-4 py-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-xs font-bold hover:bg-[var(--color-primary)]/20 transition-all"
            >
                {action.label}
            </button>
        )}
    </div>
);
