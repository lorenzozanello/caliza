/* Contrato de un futuro CRM Google Sheets. No envía, guarda ni transmite datos.
 * Nunca habilitar el endpoint antes de políticas, permisos, antiabuso y autenticación.
 */
export type LeadDraft = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
  line?: string;
  family?: string;
  sourceRoute?: string;
  privacyAccepted?: boolean;
};
export type LeadResult =
  | { ok: false; code: 'CONSENT_REQUIRED' | 'INVALID_CONTACT' | 'INVALID_MESSAGE' | 'POLICY_NOT_APPROVED' }
  | { ok: true; columns: readonly string[]; row: readonly string[] };
export const LEAD_COLUMNS = Object.freeze([
  'lead_id','created_at_utc','linea','familia','ruta_origen',
  'nombre','telefono','correo','ciudad','mensaje',
  'consentimiento_version','consentimiento_fecha_utc','estado'
]);
const ROUTES = new Set(['/contacto','/living-design/coleccion','/stone-design/brief','/stone-care/diagnostico']);
const LINES = new Set(['Stone Design','Living Design','Stone Care','CALIZA GROUP']);
const FAMILIES = new Set(['mesas-de-comedor','mesas-auxiliares','sillas-para-hogar','sillas-comerciales','lavamanos']);
function cell(value: unknown, limit: number): string {
  const raw = String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0,limit);
  return /^[=+\-@]/.test(raw) ? "'" + raw : raw; // Protege exportaciones CSV/Excel posteriores.
}
export function prepareLeadRow(
  draft: LeadDraft, server: { id: string; timestamp: string; approvedPolicyVersion?: string }
): LeadResult {
  if (!server.approvedPolicyVersion || !/^CALIZA-PRIV-[0-9A-Za-z.-]{3,30}$/.test(server.approvedPolicyVersion))
    return {ok:false,code:'POLICY_NOT_APPROVED'};
  if (draft.privacyAccepted !== true) return {ok:false,code:'CONSENT_REQUIRED'};
  const name=cell(draft.name,90),phone=cell(draft.phone,25),email=cell(draft.email,120),city=cell(draft.city,70),message=cell(draft.message,800);
  if ((!phone && !email) || (phone && !/^\+?[\d\s()-]{7,25}$/.test(phone)) ||
      (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)))
    return {ok:false,code:'INVALID_CONTACT'};
  if (message.length<8) return {ok:false,code:'INVALID_MESSAGE'};
  const line=LINES.has(draft.line||'') ? String(draft.line) : 'CALIZA GROUP';
  const family=FAMILIES.has(draft.family||'') ? String(draft.family) : '';
  const route=ROUTES.has(draft.sourceRoute||'') ? String(draft.sourceRoute) : '/contacto';
  if (!/^[0-9a-fA-F-]{36}$/.test(server.id) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(server.timestamp))
    throw new Error('La identidad y fecha deben generarse en el servidor.');
  return {ok:true,columns:LEAD_COLUMNS,row:[
    server.id,server.timestamp,line,family,route,name,phone,email,city,message,
    server.approvedPolicyVersion,server.timestamp,'nuevo'
  ]};
}
