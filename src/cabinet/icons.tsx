import React from 'react';

/**
 * Иконки сайдбара — контуры из макета (стиль Lucide, перо 1.5). Нарисованы в макете вручную
 * и в lucide-react точных совпадений нет, поэтому перенесены как есть.
 */

const Svg: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const NavIcons = {
  overview: (
    <Svg>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </Svg>
  ),
  audit: (
    <Svg>
      <path d="M3 7V4h3" />
      <path d="M21 7V4h-3" />
      <path d="M3 17v3h3" />
      <path d="M21 17v3h-3" />
      <circle cx="12" cy="12" r="3.5" />
    </Svg>
  ),
  results: (
    <Svg>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </Svg>
  ),
  page: (
    <Svg>
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6" />
      <path d="M9 16h4" />
    </Svg>
  ),
  optimize: (
    <Svg>
      <path d="M4 20 18 6" />
      <path d="M14 4h6v6" />
      <path d="M4 8h4" />
      <path d="M6 6v4" />
    </Svg>
  ),
  estimate: (
    <Svg>
      <rect x="4" y="3" width="16" height="18" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
    </Svg>
  ),
  order: (
    <Svg>
      <path d="M3 7h18v12H3z" />
      <path d="M3 11h18" />
      <path d="M8 7V4h8v3" />
    </Svg>
  ),
  positions: (
    <Svg>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </Svg>
  ),
  rivals: (
    <Svg>
      <path d="M4 21V9h5v12" />
      <path d="M15 21V4h5v17" />
      <path d="M2 21h20" />
    </Svg>
  ),
  history: (
    <Svg>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  reports: (
    <Svg>
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </Svg>
  ),
  alerts: (
    <Svg>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.5 20a2 2 0 0 0 3 0" />
    </Svg>
  ),
  settings: (
    <Svg>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
      <circle cx="9" cy="7" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="8" cy="17" r="2" />
    </Svg>
  ),
  admin: (
    <Svg>
      <path d="M12 3 4 6v6c0 4.5 3.3 8.3 8 9 4.7-.7 8-4.5 8-9V6z" />
    </Svg>
  ),
} as const;

export type NavIconId = keyof typeof NavIcons;
