const API_BASE_URL = (window.ADMIN_API_BASE_URL || localStorage.getItem('appdatmon_admin_api_base') || window.location.origin).replace(/\/$/, '');
const TOKEN_KEY = 'appdatmon_admin_token';
const USER_KEY = 'appdatmon_admin_user';
const ALLOWED = ['HOST', 'STAFF', 'ADMIN'];

let selectedTableId = null;
let tables = [];
let reservationsList = [];
let waitlistList = [];

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
  if (!el) return;
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
  if (!grid) return;
  grid.innerHTML = tables.map(t => {
    const visualStatus = t.calculatedStatus || t.status || 'AVAILABLE';
    const isPicked = Number(t.id) === Number(selectedTableId);
    return `
      <button type="button" class="tbl ${esc(visualStatus)} ${isPicked ? 'pick' : ''}" data-id="${t.id}" data-status="${esc(visualStatus)}">
        <b>Bàn #${esc(t.tableNumber)}</b>
        <small>${esc(TABLE_LABEL[visualStatus] || visualStatus)} · ${esc(t.capacity)} chỗ</small>
      </button>
    `;
  }).join('') || '<p class="empty">Chưa có bàn.</p>';
  const sel = tables.find(t => Number(t.id) === Number(selectedTableId));
  const hintEl = document.getElementById('pickHint');
  if (hintEl) {
    hintEl.textContent = sel ? `✓ Đang chọn Bàn #${sel.tableNumber} (${sel.capacity} chỗ)` : '';
  }
}

function buildTableOptions(preferredTableId, partySize = 1, allowBookedForResTableId = null) {
  const assignable = tables.filter(t => {
    const st = String(t.status || '').toUpperCase();
    if (st === 'AVAILABLE') return true;
    if (allowBookedForResTableId && Number(t.id) === Number(allowBookedForResTableId)) return true;
    if (st === 'BOOKED') return true;
    return false;
  });

  if (assignable.length === 0) {
    return `<option value="">-- Chưa có bàn trống --</option>`;
  }

  const targetId = selectedTableId || preferredTableId || assignable.find(t => Number(t.capacity) >= Number(partySize))?.id || assignable[0]?.id;

  return assignable.map(t => {
    const isSel = Number(t.id) === Number(targetId);
    const stText = TABLE_LABEL[t.status] || t.status;
    return `<option value="${t.id}" ${isSel ? 'selected' : ''}>Bàn #${esc(t.tableNumber)} (${esc(t.capacity)} chỗ - ${esc(stText)})</option>`;
  }).join('');
}

function renderReservations(list) {
  const container = document.getElementById('reservations');
  if (!container) return;
  const rows = (list || [])
    .filter(r => ['PENDING', 'CONFIRMED'].includes(String(r.status).toUpperCase()))
    .sort((a, b) => new Date(a.reservationTime) - new Date(b.reservationTime));

  container.innerHTML = rows.map(r => {
    const when = new Date(r.reservationTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    const assignedTable = r.table?.tableNumber || (tables.find(t => Number(t.id) === Number(r.table_id))?.tableNumber) || r.table_id;
    const st = String(r.status || 'PENDING').toUpperCase();

    return `
      <div class="item">
        <div class="top">
          <b>#${r.id} · ${esc(r.guestName)} (${esc(r.numberOfGuests)} khách)</b>
          <span class="pill ${esc(st)}">${st === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ xác nhận'}</span>
        </div>
        <div class="meta">
          <i class="fa-regular fa-clock"></i> ${when} · <i class="fa-solid fa-phone"></i> ${esc(r.guestPhone)}
          ${assignedTable ? ` · <b>Bàn gán: #${esc(assignedTable)}</b>` : ''}
        </div>
        ${r.note ? `<div class="meta">📝 "${esc(r.note)}"</div>` : ''}
        <div class="actions">
          <select class="table-picker" data-res-table="${r.id}" title="Chọn bàn để Check-in cho khách">
            ${buildTableOptions(r.table_id, r.numberOfGuests, r.table_id)}
          </select>
          ${st === 'PENDING' ? `<button type="button" class="primary" data-confirm-res="${r.id}"><i class="fa-solid fa-check"></i> Duyệt</button>` : ''}
          <button type="button" class="ok" data-checkin="${r.id}">
            <i class="fa-solid fa-user-check"></i> Check-in nhận bàn
          </button>
          <button type="button" class="danger" data-cancel-res="${r.id}">
            <i class="fa-solid fa-xmark"></i> Hủy
          </button>
        </div>
      </div>
    `;
  }).join('') || '<p class="empty">Không có lịch đặt bàn nào đang chờ Check-in.</p>';
}

function renderWaitlist(list) {
  const container = document.getElementById('waitlist');
  if (!container) return;
  container.innerHTML = (list || []).map(w => {
    const preferredId = w.suggestedTable?.id || null;
    return `
      <div class="item">
        <div class="top">
          <b>#${w.position} · ${esc(w.guestName)} (${esc(w.partySize)} khách)</b>
          <span class="pill ${esc(w.status)}">${w.status === 'NOTIFIED' ? '🔔 Đã gọi khách' : '⏳ Đang chờ'}</span>
        </div>
        <div class="meta">
          <i class="fa-solid fa-phone"></i> ${esc(w.guestPhone)} · Đã chờ ${w.waitedMinutes || 0} phút · Ước tính ${w.estimatedWaitMinutes || 5} phút
          ${w.note ? ` · 📝 ${esc(w.note)}` : ''}
        </div>
        <div class="meta">
          ${w.suggestedTable ? `Gợi ý bàn phù hợp: <b style="color:#16a34a">Bàn #${esc(w.suggestedTable.tableNumber)} (${esc(w.suggestedTable.capacity)} chỗ)</b>` : '<span style="color:#d97706">Chọn bàn trống bên dưới để xếp khách</span>'}
        </div>
        <div class="actions">
          <select class="table-picker" data-wl-table="${w.id}" title="Chọn bàn trống cho khách hàng chờ">
            ${buildTableOptions(preferredId, w.partySize)}
          </select>
          <button type="button" data-notify="${w.id}"><i class="fa-solid fa-bell"></i> Báo khách</button>
          <button type="button" class="ok" data-seat="${w.id}"><i class="fa-solid fa-chair"></i> Check-in / Xếp bàn</button>
          <button type="button" class="danger" data-wstatus="${w.id}" data-to="NO_SHOW">Không đến</button>
          <button type="button" class="danger" data-wstatus="${w.id}" data-to="CANCELLED">Huỷ</button>
        </div>
      </div>
    `;
  }).join('') || '<p class="empty">Hàng chờ hiện đang trống.</p>';
}

async function refresh() {
  // Tránh làm mất focus khi người dùng đang mở dropdown chọn bàn
  if (document.activeElement && document.activeElement.matches('select.table-picker, #wlForm input')) {
    return;
  }
  try {
    const [t, r, w] = await Promise.all([api('/api/tables'), api('/api/reservations'), api('/api/waitlist')]);
    tables = Array.isArray(t) ? t : [];
    reservationsList = Array.isArray(r) ? r : [];
    waitlistList = Array.isArray(w) ? w : [];

    if (selectedTableId && !tables.some(x => Number(x.id) === Number(selectedTableId) && ['AVAILABLE', 'BOOKED'].includes(String(x.status).toUpperCase()))) {
      selectedTableId = null;
    }
    renderTables();
    renderReservations(reservationsList);
    renderWaitlist(waitlistList);
  } catch (e) { toast(e.message); }
}

document.getElementById('who').textContent = user ? `— ${user.fullName || user.username} (${user.role})` : '';

document.getElementById('tables').addEventListener('click', async e => {
  const btn = e.target.closest('.tbl');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const status = String(btn.dataset.status || '').toUpperCase();

  if (status === 'CLEANING') {
    try {
      await api(`/api/tables/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'AVAILABLE' }) });
      toast('Đã dọn xong! Bàn đã chuyển sang Trống.');
    } catch (err) { toast(err.message); }
    return refresh();
  }

  if (status === 'OCCUPIED') {
    if (confirm('Chuyển bàn đang dùng này sang trạng thái Đang dọn (CLEANING)?')) {
      try {
        await api(`/api/tables/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'CLEANING' }) });
        toast('Đã chuyển bàn sang trạng thái Đang dọn.');
      } catch (err) { toast(err.message); }
      return refresh();
    }
    return;
  }

  if (status === 'AVAILABLE' || status === 'BOOKED') {
    selectedTableId = Number(selectedTableId) === id ? null : id;
    renderTables();
    // Đồng bộ tất cả dropdown chọn bàn theo bàn vừa click trên sơ đồ
    if (selectedTableId) {
      document.querySelectorAll('select.table-picker').forEach(sel => {
        if ([...sel.options].some(opt => Number(opt.value) === Number(selectedTableId))) {
          sel.value = String(selectedTableId);
        }
      });
    }
  }
});

document.getElementById('wlForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  try {
    const r = await api('/api/waitlist', { method: 'POST', body: JSON.stringify(f) });
    toast(`${r.message}. Ước tính chờ ${r.data.estimatedWaitMinutes} phút.`);
    e.target.reset();
    e.target.partySize.value = 2;
  } catch (err) { toast(err.message); }
  refresh();
});

document.getElementById('btnRefresh')?.addEventListener('click', () => refresh());

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;
  try {
    if (b.dataset.confirmRes) {
      const r = await api(`/api/reservations/${b.dataset.confirmRes}/confirm`, { method: 'PUT' });
      toast(r?.message || 'Đã duyệt lịch đặt bàn');
    } else if (b.dataset.checkin) {
      const resId = b.dataset.checkin;
      const selectEl = document.querySelector(`select[data-res-table="${resId}"]`);
      const chosenTableId = selectEl?.value ? Number(selectEl.value) : (selectedTableId || null);
      const r = await api(`/api/reservations/${resId}/check-in`, {
        method: 'PUT',
        body: JSON.stringify({ force: true, table_id: chosenTableId })
      });
      toast(r?.message || 'Đã Check-in nhận bàn thành công!');
      selectedTableId = null;
    } else if (b.dataset.cancelRes) {
      if (!confirm('Bạn chắc chắn muốn hủy lịch đặt bàn này?')) return;
      const r = await api(`/api/reservations/${b.dataset.cancelRes}/cancel`, { method: 'PUT' });
      toast(r?.message || 'Đã hủy lịch đặt bàn');
    } else if (b.dataset.notify) {
      const r = await api(`/api/waitlist/${b.dataset.notify}/notify`, { method: 'PUT' });
      toast(`Đã báo khách: ${r.smsText}`);
      try { await navigator.clipboard.writeText(r.smsText); } catch (_) {}
    } else if (b.dataset.seat) {
      const wlId = b.dataset.seat;
      const selectEl = document.querySelector(`select[data-wl-table="${wlId}"]`);
      const chosenTableId = selectEl?.value ? Number(selectEl.value) : (selectedTableId || null);
      if (!chosenTableId) return toast('Hiện chưa có bàn trống nào để xếp khách!');
      const r = await api(`/api/waitlist/${wlId}/seat`, {
        method: 'PUT',
        body: JSON.stringify({ table_id: chosenTableId })
      });
      toast(r.message || 'Đã xếp bàn thành công!');
      selectedTableId = null;
    } else if (b.dataset.wstatus) {
      if (!confirm('Xác nhận thao tác này?')) return;
      await api(`/api/waitlist/${b.dataset.wstatus}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: b.dataset.to })
      });
      toast('Đã cập nhật trạng thái hàng chờ');
    } else return;
  } catch (err) { toast(err.message); }
  refresh();
});

document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.assign('./index.html');
});

refresh();
setInterval(refresh, 8000);
