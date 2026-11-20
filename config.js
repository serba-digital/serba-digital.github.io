/* ===== KONFIGURASI - hanya file ini yang perlu Anda edit ===== */

// URL Web app dari Apps Script (Deploy > Manage deployments > Web app URL, berakhiran /exec)
const API_URL = 'https://script.google.com/macros/s/AKfycbyz_bc-4qFM6LcrIjV4DBkvgstd_nMIp8q1D7vkLt52b8caZHYMKvBefWIb3I3cWNG8/exec';

// Logo & nama untuk halaman loading kunjungan PERTAMA (setelahnya diambil otomatis dari pengaturan CMS)
const SITE = { siteTitle: 'Toko Digital', logo: '' };

/* ===== Jembatan ke Apps Script (jangan diubah) ===== */
function apiCall(action, args) {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // tanpa preflight CORS
    body: JSON.stringify({ action: action, args: args })
  }).then(r => r.json()).then(j => { if (!j.ok) throw new Error(j.error); return j.data; });
}
function makeRun(ok, fail) {
  return new Proxy({}, { get(_, name) {
    if (name === 'withSuccessHandler') return f => makeRun(f, fail);
    if (name === 'withFailureHandler') return f => makeRun(ok, f);
    return (...args) => apiCall(name, args).then(d => { if (ok) ok(d); }, e => { if (fail) fail(e); else console.error(e); });
  }});
}
const google = { script: { get run() { return makeRun(); } } };
