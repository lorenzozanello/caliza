/* CALIZA Instagram: Vercel Function. Token exclusivo de servidor, solo lectura. */
'use strict';
const ACCOUNT = 'calizastonedesign';
function safePhoto(value) {
  try {
    const u = new URL(value), host = u.hostname.toLowerCase();
    return u.protocol === 'https:' && u.pathname.length > 1 &&
      ['cdninstagram.com','fbcdn.net','fbsbx.com'].some(domain => host === domain || host.endsWith('.' + domain));
  } catch { return false; }
}
function safePost(media) {
  if (!media || String(media.username || '').toLowerCase() !== ACCOUNT) return null;
  const type = String(media.media_type || '');
  if (!['IMAGE','CAROUSEL_ALBUM','VIDEO'].includes(type)) return null;
  const url = String(media.permalink || '');
  if (!/^https:\/\/www\.instagram\.com\/(?:p|reel)\/[a-zA-Z0-9_-]{5,30}\/?$/.test(url)) return null;
  const image = type === 'VIDEO' ? media.thumbnail_url : (media.media_url || media.thumbnail_url);
  if (!safePhoto(image)) return null;
  return { url, image, caption: String(media.caption || '').replace(/\s+/g,' ').slice(0,180), type };
}
module.exports = async function handler(req,res) {
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow','GET');
    return res.status(405).json({ status:'method_not_allowed', posts:[] });
  }
  const token = process.env.CALIZA_INSTAGRAM_ACCESS_TOKEN || '';
  if (token.length < 20) return res.status(503).json({status:'not_connected',posts:[]});
  const version = /^v\d{1,2}\.\d$/.test(process.env.CALIZA_IG_API_VERSION || '')
    ? process.env.CALIZA_IG_API_VERSION : 'v25.0';
  const fields = 'id,username,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = 'https://graph.instagram.com/' + version + '/me/media?fields=' +
    encodeURIComponent(fields) + '&limit=18';
  try {
    const upstream = await fetch(url,{
      method:'GET',headers:{Authorization:'Bearer '+token,Accept:'application/json'},
      signal:AbortSignal.timeout(8500)
    });
    if (!upstream.ok) return res.status(502).json({status:'upstream_unavailable',posts:[]});
    const data = await upstream.json();
    if (!Array.isArray(data?.data)) return res.status(502).json({status:'invalid_response',posts:[]});
    if (data.data.length && data.data.every(p => String(p.username || '').toLowerCase() !== ACCOUNT)) {
      return res.status(403).json({status:'account_mismatch',posts:[]});
    }
    const seen = new Set(), posts = data.data.map(safePost).filter(p => {
      if (!p || seen.has(p.url)) return false;
      seen.add(p.url); return true;
    }).slice(0,9);
    res.setHeader('Cache-Control','public, s-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({status:'connected',account:ACCOUNT,posts});
  } catch {
    return res.status(502).json({status:'upstream_unavailable',posts:[]});
  }
};
