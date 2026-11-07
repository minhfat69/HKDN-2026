const API_BASE_URL = (window.ADMIN_API_BASE_URL || localStorage.getItem('appdatmon_admin_api_base') || window.location.origin).replace(/\/$/, '');
const TOKEN_KEY = 'appdatmon_admin_token';
const USER_KEY = 'appdatmon_admin_user';
const ALLOWED = ['HOST', 'STAFF', 'ADMIN'];

let selectedTableId = null;
let tables = [];

const token = localStorage.getItem(TOKEN_KEY);
let user = null;
try { user = JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch (e) { user = null; }
if (!token || !user || !ALLOWED.includes(String(user.role).toUpperCase())) {
  window.location.replace('./index.html');
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.style.display = 'none'; }, 4500);
}

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  const raw = await res.text();
  const body = raw ? JSON.parse(raw) : null;
  if (res.status === 401) { localStorage.removeItem(TOKEN_KEY); window.location.replace('./index.html'); }
  if (!res.ok) throw new Error(body?.message || 'Yêu cầu thất bại');
  return body;
}

const TABLE_LABEL = { AVAILABLE: 'Trống', BOOKED: 'Đã đặt', OCCUPIED: 'Đang dùng', CLEANING: 'Đang dọn' };

function renderTables() {
  const grid = document.getElementById('tables');
  grid.innerHTML = tables.map(t => `
    <button class="tbl ${esc(t.status)} ${t.id === selectedTableId ? 'pick' : ''}" data-id="${t.id}" data-status="${esc(t.status)}">
      <b>Bàn ${esc(t.tableNumber)}</b><small>${esc(TABLE_LABEL[t.status] || t.status)} · ${esc(t.capacity)} chỗ</small>
    </button>`).join('') || '<p class="empty">Chưa có bàn.</p>';
  const sel = tables.find(t => t.id === selectedTableId);
  document.getElementById('pickHint').textContent = sel ? `— đã chọn bàn ${sel.tableNumber}` : '';
}

function renderReservations(list) {
  const now = Date.now();
  const rows = list
    .filter(r => ['PENDING', 'CONFIRMED'].includes(String(r.status).toUpperCase()))
    .sort((a, b) => new Date(a.reservationTime) - new Date(b.reservationTime))
    .slice(0, 8);
  document.getElementById('reservations').innerHTML = rows.map(r => {
    const diff = Math.round((new Date(r.reservationTime) - now) / 60000);
    const canCheckIn = diff >= -30 && diff <= 30;
    const when = new Date(r.reservationTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    return `<div class="item"><div class="top"><b>${esc(r.guestName)} · ${esc(r.numberOfGuests)} khách</b><span class="pill">${esc(r.status)}</span></div>
      <div class="meta">${when} · ${esc(r.guestPhone)}${r.table ? ` · Bàn ${esc(r.table.tableNumber)}` : ''}</div>
      <div class="actions"><button class="ok" data-checkin="${r.id}" ${canCheckIn ? '' : 'disabled title="Chỉ nhận bàn trong ±30 phút quanh giờ hẹn"'}>Check-in</button></div></div>`;
  }).join('') || '<p class="empty">Không có đặt bàn chờ xử lý.</p>';
}

function renderWaitlist(list) {
  document.getElementById('waitlist').innerHTML = list.map(w => `
    <div class="item"><div class="top"><b>#${w.position} ${esc(w.guestName)} · ${esc(w.partySize)} khách</b><span class="pill ${esc(w.status)}">${w.status === 'NOTIFIED' ? 'Đã báo' : 'Đang chờ'}</span></div>
      <div class="meta">${esc(w.guestPhone)} · đã chờ ${w.waitedMinutes} phút · ước tính ${w.estimatedWaitMinutes} phút${w.note ? ` · ${esc(w.note)}` : ''}</div>
      <div class="meta">${w.suggestedTable ? `Bàn trống phù hợp: <b>Bàn ${esc(w.suggestedTable.tableNumber)}</b> (${esc(w.suggestedTable.capacity)} chỗ)` : 'Hiện chưa có bàn trống đủ chỗ'}</div>
      <div class="actions">
        <button data-notify="${w.id}">Báo khách</button>
        <button class="ok" data-seat="${w.id}">Xếp bàn đã chọn</button>
        <button class="danger" data-wstatus="${w.id}" data-to="NO_SHOW">Không đến</button>
        <button class="danger" data-wstatus="${w.id}" data-to="CANCELLED">Huỷ</button>
      </div></div>`).join('') || '<p class="empty">Hàng chờ đang trống.</p>';
}

async function refresh() {
  try {
    const [t, r, w] = await Promise.all([api('/api/tables'), api('/api/reservations'), api('/api/waitlist')]);
    tables = Array.isArray(t) ? t : [];
    if (!tables.some(x => x.id === selectedTableId && x.status === 'AVAILABLE')) selectedTableId = null;
    renderTables();
    renderReservations(Array.isArray(r) ? r : []);
    renderWaitlist(Array.isArray(w) ? w : []);
  } catch (e) { toast(e.message); }
}

document.getElementById('who').textContent = user ? `— ${user.fullName || user.username} (${user.role})` : '';

document.getElementById('tables').addEventListener('click', async e => {
  const btn = e.target.closest('.tbl');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.status === 'CLEANING') {
    try { await api(`/api/tables/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'AVAILABLE' }) }); toast('Bàn đã sẵn sàng'); } catch (err) { toast(err.message); }
    return refresh();
  }
  if (btn.dataset.status === 'AVAILABLE') { selectedTableId = selectedTableId === id ? null : id; renderTables(); }
});

document.getElementById('wlForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  try {
    const r = await api('/api/waitlist', { method: 'POST', body: JSON.stringify(f) });
    toast(`${r.message}. Ước tính chờ ${r.data.estimatedWaitMinutes} phút.`);
    e.target.reset(); e.target.partySize.value = 2;
  } catch (err) { toast(err.message); }
  refresh();
});

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;
  try {
    if (b.dataset.checkin) {
      const r = await api(`/api/reservations/${b.dataset.checkin}/check-in`, { method: 'PUT' });
      toast(r?.message || 'Đã check-in');
    } else if (b.dataset.notify) {
      const r = await api(`/api/waitlist/${b.dataset.notify}/notify`, { method: 'PUT' });
      toast(`Nội dung gửi khách: ${r.smsText}`);
      try { await navigator.clipboard.writeText(r.smsText); } catch (_) {}
    } else if (b.dataset.seat) {
      if (!selectedTableId) return toast('Hãy chọn một bàn trống (màu xanh lá) trước');
      const r = await api(`/api/waitlist/${b.dataset.seat}/seat`, { method: 'PUT', body: JSON.stringify({ table_id: selectedTableId }) });
      toast(r.message); selectedTableId = null;
    } else if (b.dataset.wstatus) {
      if (!confirm('Xác nhận thao tác này?')) return;
      await api(`/api/waitlist/${b.dataset.wstatus}/status`, { method: 'PUT', body: JSON.stringify({ status: b.dataset.to }) });
    } else return;
  } catch (err) { toast(err.message); }
  refresh();
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY);
  window.location.assign('./index.html');
});

refresh();
setInterval(refresh, 8000);
