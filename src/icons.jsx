import React from 'react';

// Small icon set — thin strokes, 1.6px, currentColor
export const Icon = ({ children, size = 16, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" {...rest}>{children}</svg>
);

export const IcArrowRight = (p) => <Icon {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Icon>;
export const IcArrowLeft  = (p) => <Icon {...p}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></Icon>;
export const IcChevRight  = (p) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
export const IcChevLeft   = (p) => <Icon {...p}><path d="m15 6-6 6 6 6" /></Icon>;
export const IcChevUp     = (p) => <Icon {...p}><path d="m6 15 6-6 6 6" /></Icon>;
export const IcChevDown   = (p) => <Icon {...p}><path d="m6 9 6 6 6-6" /></Icon>;
export const IcClose      = (p) => <Icon {...p}><path d="M6 6l12 12M18 6 6 18" /></Icon>;
export const IcCheck      = (p) => <Icon {...p}><path d="m5 12 4 4L19 7" /></Icon>;
export const IcDownload   = (p) => <Icon {...p}><path d="M12 4v12" /><path d="m6 10 6 6 6-6" /><path d="M5 20h14" /></Icon>;
export const IcUpload     = (p) => <Icon {...p}><path d="M12 20V8" /><path d="m6 14 6-6 6 6" /><path d="M5 4h14" /></Icon>;
export const IcEye        = (p) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const IcGrid       = (p) => <Icon {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Icon>;
export const IcRows       = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></Icon>;
export const IcColumns    = (p) => <Icon {...p}><rect x="4" y="3" width="5" height="18" rx="1.2" /><rect x="11" y="3" width="5" height="18" rx="1.2" /><rect x="18" y="3" width="2.5" height="18" rx="1" /></Icon>;
export const IcClock      = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
export const IcTable      = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="1.5" /><path d="M3 10h18M3 15h18M9 4v16M15 4v16" /></Icon>;
export const IcSlides     = (p) => <Icon {...p}><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M9 21h6M12 17v4" /></Icon>;
export const IcDoc        = (p) => <Icon {...p}><path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v4h4" /></Icon>;
export const IcSpark      = (p) => <Icon {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></Icon>;
export const IcShare      = (p) => <Icon {...p}><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v14" /></Icon>;
export const IcPlay       = (p) => <Icon {...p}><path d="M7 5v14l12-7Z" fill="currentColor" stroke="none" /></Icon>;
export const IcSettings   = (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></Icon>;
