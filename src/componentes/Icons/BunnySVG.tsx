import React from 'react';

export default function BunnySVG({ className = '', width = 40, height = 40 }: { className?: string; width?: number; height?: number; }) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="14" cy="10" rx="3" ry="8" fill="#00bfff" stroke="#fff" strokeWidth="2" />
      <ellipse cx="26" cy="10" rx="3" ry="8" fill="#00bfff" stroke="#fff" strokeWidth="2" />
      <ellipse cx="20" cy="22" rx="10" ry="10" fill="#00bfff" stroke="#fff" strokeWidth="2" />
      <ellipse cx="20" cy="26" rx="2" ry="1.2" fill="#fff" />
      <ellipse cx="16" cy="22" rx="1" ry="1.5" fill="#fff" />
      <ellipse cx="24" cy="22" rx="1" ry="1.5" fill="#fff" />
      <path d="M18 28 Q20 30 22 28" stroke="#fff" strokeWidth="1.5" fill="none" />
      <g>
        <polyline points="7,10 12,13 9,17" stroke="#fff200" strokeWidth="2" fill="none" />
        <polyline points="33,10 28,13 31,17" stroke="#fff200" strokeWidth="2" fill="none" />
        <polyline points="20,2 18,7 22,7" stroke="#fff200" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}
