import React from 'react';

interface FlameMeterProps {
  className?: string;
}

export default function FlameMeter({ className = '' }: FlameMeterProps) {
  return (
    <div className={`relative inline-flex items-end justify-center ${className}`}>
      <svg viewBox="0 0 48 64" className="w-full h-full overflow-visible">
        <defs>
          <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#ff6b2b" floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Outer flame */}
        <path
          d="M24 60 C10 48, 2 32, 10 16 C14 10, 20 6, 24 2 C28 6, 34 10, 38 16 C46 32, 38 48, 24 60Z"
          fill="#ff4757"
          opacity="0.45"
          filter="url(#flameGlow)"
          className="flame-layer"
          style={{ animationDelay: '0s', animationDuration: '1.3s' }}
        />
        {/* Middle flame */}
        <path
          d="M24 54 C14 44, 8 30, 14 20 C17 14, 22 10, 24 6 C26 10, 31 14, 34 20 C40 30, 34 44, 24 54Z"
          fill="#ff6b2b"
          opacity="0.65"
          filter="url(#flameGlow)"
          className="flame-layer"
          style={{ animationDelay: '0.25s', animationDuration: '1.05s' }}
        />
        {/* Inner flame */}
        <path
          d="M24 48 C18 40, 14 28, 18 22 C20 18, 22 14, 24 12 C26 14, 28 18, 30 22 C34 28, 30 40, 24 48Z"
          fill="#f5a623"
          filter="url(#flameGlow)"
          className="flame-layer"
          style={{ animationDelay: '0.5s', animationDuration: '0.85s' }}
        />
      </svg>
    </div>
  );
}
