const DEFAULT_DEV_HTTP = 'http://localhost:3020/api';
const DEFAULT_DEV_ASSETS = 'http://localhost:3020/src/srcSisproind/plataforma';
const DEFAULT_PROD_ASSETS = 'https://www.sisproind.com/plataforma';
const DEFAULT_DEV_FIRMAS = 'http://localhost:3020/firmas/instructores';
const DEFAULT_PROD_FIRMAS = 'https://www.sisproind.com/plataforma/firmas/instructores';
const DEFAULT_DEV_DIPLOMAS = 'http://localhost:3020/plataforma/diplomas';
const DEFAULT_PROD_DIPLOMAS = 'https://www.sisproind.com/plataforma/diplomas';

const getDefaultProdHttps = () => {
  if (typeof window === 'undefined' || !window.location || !window.location.hostname) {
    return 'https://localhost:8443';
  }
  return `https://${window.location.hostname}:8443`;
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
    return normalizeBaseUrl(process.env.REACT_APP_ASSETS_PROD_URL || DEFAULT_PROD_ASSETS);
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
  const origin = getAssetsOrigin();
  if (!origin) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath.startsWith('/diplomas/')) {
    return `${origin}/plataforma${normalizedPath}`;
  }
  if (normalizedPath.startsWith('/plataforma/')) {
    return `${origin}${normalizedPath}`;
  }
  if (normalizedPath.startsWith('/fondos/temas/')) {
    return `${origin}/plataforma${normalizedPath}`;
  }
  return `${origin}/plataforma/diplomas${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
};

export const getFirmasBaseUrl = () => {
  const explicit = process.env.REACT_APP_FIRMAS_URL;
  if (explicit) return normalizeBaseUrl(explicit);

  if (process.env.NODE_ENV === 'production') {
    return normalizeBaseUrl(process.env.REACT_APP_FIRMAS_PROD_URL || DEFAULT_PROD_FIRMAS);
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
    return normalizeBaseUrl(process.env.REACT_APP_DIPLOMAS_PROD_URL || DEFAULT_PROD_DIPLOMAS);
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
