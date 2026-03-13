import { useState, useCallback, useRef } from 'react';

export function useDragAndDrop<T>(
    items: T[],
    onReorder: (newItems: T[]) => void
) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const dragNodeRef = useRef<HTMLElement | null>(null);

    const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
        setDragIndex(index);
        dragNodeRef.current = e.currentTarget as HTMLElement;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        // Make drag image slightly transparent
        requestAnimationFrame(() => {
            if (dragNodeRef.current) {
                dragNodeRef.current.style.opacity = '0.4';
            }
        });
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragIndex !== null && dragIndex !== index) {
            setOverIndex(index);
        }
    }, [dragIndex]);

    const handleDragEnter = useCallback((e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIndex !== null && dragIndex !== index) {
            setOverIndex(index);
        }
    }, [dragIndex]);

    const handleDragLeave = useCallback((_e: React.DragEvent) => {
        // Only clear if leaving the drop zone entirely
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === dropIndex) {
            setDragIndex(null);
            setOverIndex(null);
            return;
        }

        const newItems = [...items];
        const [removed] = newItems.splice(dragIndex, 1);
        newItems.splice(dropIndex, 0, removed);
        onReorder(newItems);

        setDragIndex(null);
        setOverIndex(null);
    }, [dragIndex, items, onReorder]);

    const handleDragEnd = useCallback((_e: React.DragEvent) => {
        if (dragNodeRef.current) {
            dragNodeRef.current.style.opacity = '1';
        }
        setDragIndex(null);
        setOverIndex(null);
        dragNodeRef.current = null;
    }, []);

    const getDragProps = useCallback((index: number) => ({
        draggable: true,
        onDragStart: (e: React.DragEvent) => handleDragStart(e, index),
        onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
        onDragEnter: (e: React.DragEvent) => handleDragEnter(e, index),
        onDragLeave: handleDragLeave,
        onDrop: (e: React.DragEvent) => handleDrop(e, index),
        onDragEnd: handleDragEnd,
    }), [handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDrop, handleDragEnd]);

    const getRowClassName = useCallback((index: number) => {
        if (dragIndex === index) return 'opacity-40 scale-[0.98]';
        if (overIndex === index && dragIndex !== null) return 'border-t-2 !border-t-[#c5a059]';
        return '';
    }, [dragIndex, overIndex]);

    return {
        dragIndex,
        overIndex,
        getDragProps,
        getRowClassName,
        isDragging: dragIndex !== null,
    };
}
