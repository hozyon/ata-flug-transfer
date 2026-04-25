import React from 'react';

interface AdminConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
    isOpen, onClose, onConfirm, title, description, 
    confirmLabel = 'Onayla', cancelLabel = 'İptal', type = 'info'
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: 'bg-red-500/10',
            icon: 'fa-trash-can text-red-400',
            button: 'bg-red-500 hover:bg-red-600',
            border: 'border-red-500/20'
        },
        warning: {
            bg: 'bg-amber-500/10',
            icon: 'fa-triangle-exclamation text-amber-400',
            button: 'bg-amber-500 hover:bg-amber-600',
            border: 'border-amber-500/20'
        },
        info: {
            bg: 'bg-blue-500/10',
            icon: 'fa-circle-info text-blue-400',
            button: 'bg-blue-500 hover:bg-blue-600',
            border: 'border-blue-500/20'
        }
    }[type];

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-sm rounded-3xl bg-[#0b0f19] border ${colors.border} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>
                <div className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
                        <i className={`fa-solid ${colors.icon} text-xl`}></i>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border-t border-white/[0.06] flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:bg-white/5 transition-all">
                        {cancelLabel}
                    </button>
                    <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] ${colors.button}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};
