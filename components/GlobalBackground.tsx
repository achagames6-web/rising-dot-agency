'use client';

/**
 * GlobalBackground - Static gradient orbs for consistent background effects
 * Optimized for performance - no animations, reduced blur
 */
export default function GlobalBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Large purple orb - top left */}
      <div
        className="fixed rounded-full pointer-events-none"
        style={{
          left: '5%',
          top: '10%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Blue orb - top right */}
      <div
        className="fixed rounded-full pointer-events-none"
        style={{
          right: '10%',
          top: '20%',
          width: '400px',
          height: '400px',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
        }}
      />

      {/* Purple orb - bottom */}
      <div
        className="fixed rounded-full pointer-events-none"
        style={{
          left: '50%',
          bottom: '10%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }}
      />
    </div>
  );
}
