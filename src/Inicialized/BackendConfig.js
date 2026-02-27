const DEFAULT_DEV_HTTP = 'http://localhost:3020/api';

// In VPS/prod we serve assets from the same origin via nginx:
// - /firmas/instructores/*
// - /diplomas/*
// Avoid hardcoding www + /plataforma to prevent CORS/mixed-origin issues.
const DEFAULT_DEV_ASSETS = 'http://localhost:3020';
const DEFAULT_PROD_ASSETS = '';

const DEFAULT_DEV_FIRMAS = 'http://localhost:3020/firmas/instructores';
const DEFAULT_PROD_FIRMAS = '';

const DEFAULT_DEV_DIPLOMAS = 'http://localhost:3020/diplomas';
const DEFAULT_PROD_DIPLOMAS = '';

const getDefaultProdHttps = () => {
  // In production we serve the frontend behind nginx and proxy backend routes.
  // So the backend base can be same-origin (no explicit port).
  if (typeof window === 'undefined' || !window.location || !window.location.origin) {
    return 'https://localhost';
  }
  return window.location.origin;
};

const normalizeBaseUrl = (url) => {
  if (!url) return '';
  return url.replace(/\/$/, '');
};

export const getBackendBaseUrl = () => {
  const explicit = process.env.REACT_APP_BACKEND_URL;
  if (explicit) return normalizeBaseUrl(explicit);

  if (process.env.NODE_ENV === 'production') {
    return normalizeBaseUrl(process.env.REACT_APP_BACKEND_PROD_URL || getDefaultProdHttps());
  }

  return normalizeBaseUrl(process.env.REACT_APP_BACKEND_DEV_URL || DEFAULT_DEV_HTTP);
};

export const buildBackendUrl = (path) => {
  if (!path) return getBackendBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;
  const base = getBackendBaseUrl();
  if (!base) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const getAssetsBaseUrl = () => {
  const explicit = process.env.REACT_APP_ASSETS_URL;
  if (explicit) return normalizeBaseUrl(explicit);

  if (process.env.NODE_ENV === 'production') {
    // default: same-origin
    return normalizeBaseUrl(process.env.REACT_APP_ASSETS_PROD_URL || window.location.origin);
  }

  return normalizeBaseUrl(process.env.REACT_APP_ASSETS_DEV_URL || DEFAULT_DEV_ASSETS);
};

const getAssetsOrigin = () => {
  const base = getAssetsBaseUrl();
  if (!base) return '';
  return base
    .replace(/\/src\/srcSisproind\/plataforma\/?$/, '')
    .replace(/\/plataforma\/?$/, '');
};

export const buildAssetsUrl = (path) => {
  if (!path) return getAssetsBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;
  const base = getAssetsBaseUrl();
  if (!base) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const buildFondoDiplomaUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;

  // Same-origin assets (nginx serves /diplomas/*)
  const origin = window?.location?.origin || '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Accept either /diplomas/* or legacy /plataforma/diplomas/*
  if (normalizedPath.startsWith('/plataforma/')) {
    return `${origin}${normalizedPath.replace(/^\/plataforma\//, '/')}`;
  }

  // If DB already stores /diplomas/* we keep it.
  if (normalizedPath.startsWith('/diplomas/')) {
    return `${origin}${normalizedPath}`;
  }

  // Fallback: treat as filename under /diplomas
  return `${origin}/diplomas/${normalizedPath.replace(/^\//, '')}`;
};

export const getFirmasBaseUrl = () => {
  const explicit = process.env.REACT_APP_FIRMAS_URL;
  if (explicit) return normalizeBaseUrl(explicit);

  if (process.env.NODE_ENV === 'production') {
    // default: same-origin
    return normalizeBaseUrl(process.env.REACT_APP_FIRMAS_PROD_URL || window.location.origin);
  }

  return normalizeBaseUrl(process.env.REACT_APP_FIRMAS_DEV_URL || DEFAULT_DEV_FIRMAS);
};

export const buildFirmaUrl = (path) => {
  if (!path) return getFirmasBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;
  const base = getFirmasBaseUrl();
  if (!base) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const firmasPrefix = '/firmas/instructores';
  if (normalizedPath.startsWith(firmasPrefix)) {
    const baseOrigin = base.replace(/\/firmas\/instructores\/?$/, '');
    return `${baseOrigin}${normalizedPath}`;
  }
  return `${base}${normalizedPath}`;
};

export const getDiplomasBaseUrl = () => {
  const explicit = process.env.REACT_APP_DIPLOMAS_URL;
  if (explicit) return normalizeBaseUrl(explicit);

  if (process.env.NODE_ENV === 'production') {
    // default: same-origin
    return normalizeBaseUrl(process.env.REACT_APP_DIPLOMAS_PROD_URL || window.location.origin);
  }

  return normalizeBaseUrl(process.env.REACT_APP_DIPLOMAS_DEV_URL || DEFAULT_DEV_DIPLOMAS);
};

export const buildDiplomaUrl = (path) => {
  if (!path) return getDiplomasBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;
  const base = getDiplomasBaseUrl();
  if (!base) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};
