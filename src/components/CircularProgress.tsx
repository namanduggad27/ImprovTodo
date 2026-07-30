import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  completedCount: number;
  totalCount: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ 
  percentage, 
  size = 44, 
  strokeWidth = 4,
  completedCount,
  totalCount
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isComplete ? 'hsl(165, 70%, 42%)' : 'var(--accent-primary)'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
            filter: isComplete ? 'drop-shadow(0 0 4px rgba(32, 180, 134, 0.6))' : 'none'
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        fontSize: '0.65rem',
        fontWeight: 700,
        color: isComplete ? 'hsl(165, 70%, 42%)' : 'var(--text-secondary)',
        fontVariantNumeric: 'tabular-nums',
        transition: 'color 0.4s ease'
      }}>
        {completedCount}/{totalCount}
      </div>
    </div>
  );
};
