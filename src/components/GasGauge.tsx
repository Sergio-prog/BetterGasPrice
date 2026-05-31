import React from 'react';

interface GasGaugeProps {
  value?: number;
  label: string;
  color: string;
  size?: number;
  suffix?: string;
  loading?: boolean;
  live?: boolean;
  maxVal?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function tickPosition(cx: number, cy: number, r: number, angleDeg: number, length: number) {
  const outer = polarToCartesian(cx, cy, r, angleDeg);
  const inner = polarToCartesian(cx, cy, r - length, angleDeg);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
}

export default function GasGauge({ value, label, color, size = 200, suffix = 'GWEI', loading = false, live = false, maxVal }: GasGaugeProps) {
  const max = maxVal ?? Math.max((value ?? 0) * 1.5, 10);
  const percentage = Math.min((value ?? 0) / max, 1);

  const startAngle = 135;
  const sweep = 270;
  const endAngle = startAngle + sweep;
  const currentAngle = startAngle + sweep * percentage;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const strokeWidth = 10;

  const trackPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const valuePath = describeArc(cx, cy, radius, startAngle, currentAngle);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => {
    const angle = startAngle + sweep * p;
    return tickPosition(cx, cy, radius + 4, angle, 6);
  });

  const displayValue = loading ? '--' : value !== undefined ? value.toFixed(3) : '--';
  const glowId = `glow-${label.replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor={color} floodOpacity="0.5" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`grad-${glowId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        ))}

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        <path
          d={valuePath}
          fill="none"
          stroke={`url(#grad-${glowId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/* Inner decorative ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius - 18}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={1}
        />

        {/* Value text */}
        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={loading ? 'rgba(255,255,255,0.15)' : '#f0f0f5'}
          fontSize={size > 220 ? 38 : 28}
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontWeight="700"
          letterSpacing="-0.02em"
        >
          {displayValue}
        </text>

        {/* Suffix */}
        <text
          x={cx}
          y={cy + (size > 220 ? 30 : 24)}
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize={size > 220 ? 13 : 11}
          fontFamily="'Sora', ui-sans-serif, system-ui, sans-serif"
          letterSpacing="0.12em"
        >
          {suffix}
        </text>
      </svg>

      {/* Label */}
      <div className="mt-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium"
          style={{ fontFamily: "'Sora', ui-sans-serif, system-ui, sans-serif" }}
        >
          {label}
        </span>
        {live && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-breathe" />
            <span className="text-[9px] tracking-[0.25em] uppercase text-white/25 font-body font-medium">
              Live
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
