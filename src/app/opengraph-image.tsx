import { ImageResponse } from 'next/og';

export const alt = 'Ata Flug Transfer — VIP Airport Transfer Antalya';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #1a2540 100%)',
                    position: 'relative',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Gold accent line top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #9e7b38, #c5a059, #e8d49a, #c5a059, #9e7b38)' }} />

                {/* Gold corner decoration */}
                <div style={{ position: 'absolute', top: '40px', left: '60px', width: '60px', height: '2px', background: '#c5a059', opacity: 0.6 }} />
                <div style={{ position: 'absolute', top: '40px', right: '60px', width: '60px', height: '2px', background: '#c5a059', opacity: 0.6 }} />

                {/* Eyebrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '32px', height: '2px', background: '#c5a059' }} />
                    <span style={{ color: '#c5a059', fontSize: '14px', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                        Premium VIP Transfer
                    </span>
                    <div style={{ width: '32px', height: '2px', background: '#c5a059' }} />
                </div>

                {/* Business name */}
                <div style={{ color: 'white', fontSize: '64px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '16px', textAlign: 'center' }}>
                    ATA FLUG TRANSFER
                </div>

                {/* Tagline */}
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '24px', fontWeight: 400, marginBottom: '48px', textAlign: 'center' }}>
                    Antalya Havalimanı · Kemer · Belek · Side · Alanya
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    {['7/24 Hizmet', 'Mercedes Vito', 'Sabit Fiyat'].map(badge => (
                        <div key={badge} style={{
                            background: 'rgba(197,160,89,0.12)',
                            border: '1px solid rgba(197,160,89,0.35)',
                            borderRadius: '100px',
                            padding: '10px 22px',
                            color: '#c5a059',
                            fontSize: '16px',
                            fontWeight: 700,
                        }}>
                            {badge}
                        </div>
                    ))}
                </div>

                {/* Bottom accent */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #9e7b38, #c5a059, #e8d49a, #c5a059, #9e7b38)' }} />
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
