export const PAGE_SIZE_DEFAULT = 10;

export const BLOG = {
  TITLE_MIN: 5,
  TITLE_MAX: 180,
  CONTENT_MIN: 20,
  BANNER_MAX_MB: 2,
} as const;

export const COMMENT = {
  CONTENT_MAX: 1000,
} as const;

export const USERNAME = {
  MIN: 3,
  MAX: 20,
} as const;

export const EMAIL_MAX = 50;
