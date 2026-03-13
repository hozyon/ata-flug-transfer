import React, { useEffect, useState } from 'react';
import { haptic } from '../../utils/haptic';

interface ContextAction {
    id: string;
    label: string;
    icon: string;
    color: string;
    onClick: () => void;
    destructive?: boolean;
}

interface ContextMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position: { top: number; left: number };
    actions: ContextAction[];
    children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, onClose, position, actions, children }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            haptic.success();
            setShow(true);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen && !show) return null;

    return (
        <div className="fixed inset-0 z-[999] touch-none">
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => { haptic.tap(); onClose(); }}
            />

            <div
                className={`absolute transition-all duration-300 transform ${show ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}`}
                style={{ top: position.top, left: position.left, right: '16px', maxWidth: '400px', margin: '0 auto' }}
            >
                <div className="relative z-10 shadow-2xl shadow-black/50 pointer-events-none mb-3">
                    {children}
                </div>

                <div className={`flex flex-col gap-1 w-64 ${position.top > window.innerHeight / 2 ? 'absolute bottom-full mb-3 right-0' : 'absolute top-full mt-3 right-0'}`}>
                    <div className="bg-[#1e293b]/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
                        {actions.map((action, idx) => (
                            <button
                                key={action.id}
                                onClick={(e) => { e.stopPropagation(); action.onClick(); onClose(); }}
                                className={`w-full flex items-center justify-between px-4 py-3.5 text-[13px] font-bold transition-colors active:bg-white/10 ${action.destructive ? 'text-red-400' : 'text-white'} ${idx !== 0 ? 'border-t border-white/[0.04]' : ''}`}
                            >
                                {action.label}
                                <i className={`fa-solid ${action.icon} ${action.color}`}></i>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
