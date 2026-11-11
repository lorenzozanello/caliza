/* CALIZA: condiciones explícitas para un futuro lanzamiento.
 * Ninguna bandera se activa automáticamente en QA ni por declarar un dominio.
 * Este módulo solo evalúa variables; no administra DNS, credenciales ni pagos.
 */
type SafeEnv = Record<string, string | undefined>;
const YES = 'true';
export const CALIZA_TARGET_DOMAIN = 'calizagroup.shop';

function canonicalDomainVerified(env: SafeEnv): boolean {
  const raw = env.NEXT_PUBLIC_SITE_URL || '';
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' &&
      (u.hostname === CALIZA_TARGET_DOMAIN || u.hostname === 'www.' + CALIZA_TARGET_DOMAIN) &&
      u.pathname === '/' && !u.search && !u.hash && !u.username && !u.password && !u.port;
  } catch { return false; }
}

export function publicSiteApproved(env: SafeEnv = process.env): boolean {
  return canonicalDomainVerified(env) &&
    env.CALIZA_DOMAIN_VERIFIED === YES &&
    env.CALIZA_LEGAL_APPROVED === YES &&
    env.CALIZA_PUBLICATION_APPROVED === YES;
}

export function commerceApproved(env: SafeEnv = process.env): boolean {
  return publicSiteApproved(env) &&
    env.CALIZA_PRODUCTS_APPROVED === YES &&
    env.CALIZA_CHECKOUT_APPROVED === YES &&
    env.CALIZA_PAYMENT_PROVIDER_APPROVED === YES &&
    env.PAYMENTS_PROVIDER === 'wompi';
}

export function previewSimulationApproved(env: SafeEnv = process.env): boolean {
  return env.NODE_ENV !== 'production' &&
    env.VERCEL_ENV === 'preview' &&
    env.CALIZA_TEST_PAYMENTS_APPROVED === YES &&
    env.PAYMENTS_PROVIDER === 'simulated';
}
