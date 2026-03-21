interface ActivityEntry {
    id: string;
    action: string;
    details: string;
    type: 'blog' | 'booking' | 'fleet' | 'settings' | 'review' | 'other';
    timestamp: string;
}

const LS_KEY = 'ata_activity_log_v1';

export function logActivity(
    action: string,
    details: string,
    type: 'blog' | 'booking' | 'fleet' | 'settings' | 'review' | 'other'
): void {
    try {
        const existing: ActivityEntry[] = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        const entry: ActivityEntry = {
            id: Date.now().toString(),
            action,
            details,
            type,
            timestamp: new Date().toISOString(),
        };
        // Keep max 200 entries
        const updated = [entry, ...existing].slice(0, 200);
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
    } catch {}
}
