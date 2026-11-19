// Modular Reservations View (Giao diện Quản lý Đặt bàn trước)
import { RESERVATION_STATUS_MAP } from '../config.js';
import { formatDateTime, formatNumber, escapeHtml, userInitials } from '../utils.js';

export function renderReservationFilterPills(containerEl, records, activeFilter = 'ALL') {
  if (!containerEl) return;

  const raw = records || [];
  const counts = {
    ALL: raw.length,
    PENDING: raw.filter(r => String(r.status).toUpperCase() === 'PENDING').length,
    CONFIRMED: raw.filter(r => String(r.status).toUpperCase() === 'CONFIRMED').length,
    CHECKED_IN: raw.filter(r => String(r.status).toUpperCase() === 'CHECKED_IN').length,
    CANCELLED: raw.filter(r => String(r.status).toUpperCase() === 'CANCELLED').length
  };

  const pills = [
    { id: 'ALL', label: 'Tất cả', count: counts.ALL },
    { id: 'PENDING', label: '⏳ Chờ duyệt', count: counts.PENDING },
    { id: 'CONFIRMED', label: '⚡ Đã xác nhận', count: counts.CONFIRMED },
    { id: 'CHECKED_IN', label: '📌 Đã nhận bàn', count: counts.CHECKED_IN },
    { id: 'CANCELLED', label: '❌ Đã hủy', count: counts.CANCELLED }
  ];

  containerEl.innerHTML = pills.map(p => {
    const active = activeFilter === p.id;
    return `
      <button class="filter-tab ${active ? 'active' : ''}" data-action="filter-reservation" data-status="${p.id}">
        <span>${p.label}</span>
        <span class="filter-tab-count">${p.count}</span>
      </button>
    `;
  }).join('');
}

export function renderReservationsGrid(records, activeFilter = 'ALL') {
  if (!records || records.length === 0) {
    return `<div class="empty-state"><strong>Không có lịch đặt bàn phù hợp</strong></div>`;
  }

  let filtered = records;
  if (activeFilter && activeFilter !== 'ALL') {
    filtered = records.filter(r => String(r.status).toUpperCase() === activeFilter);
  }

  if (filtered.length === 0) {
    return `<div class="empty-state"><strong>Không tìm thấy lịch đặt bàn ở trạng thái này</strong></div>`;
  }

  const tables = Array.isArray(window.__tablesList) ? window.__tablesList : [];
  const allUsers = Array.isArray(window.__usersList) ? window.__usersList : [];

  return `
    <div class="reservations-grid">
      ${filtered.map(res => {
        const initials = userInitials({ fullName: res.guestName });
        const tableStr = res.table?.tableNumber ? `#${res.table.tableNumber}` : res.table_id ? `#${res.table_id}` : 'Chưa xếp';
        const rawStatus = String(res.status || 'PENDING').toUpperCase();

        const cleanPhone = String(res.guestPhone || '').trim();
        const matchedUser = res.User || allUsers.find(u =>
          (res.user_id && String(u.id) === String(res.user_id)) ||
          (cleanPhone && String(u.phone || '').trim() === cleanPhone)
        );
        const isMember = Boolean(matchedUser || res.isMember);
        const memberBadgeHtml = isMember
          ? `<span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.74rem"><i class="fa-solid fa-crown"></i> Thành viên (${escapeHtml(matchedUser?.tier || res.memberTier || 'MEMBER')} • ${formatNumber(matchedUser?.points ?? res.memberPoints ?? 0)}đ)</span>`
          : `<span class="badge-inline" style="background:#f1f5f9; color:#475569; font-weight:700; font-size:0.74rem"><i class="fa-regular fa-user"></i> Khách vãng lai</span>`;

        const assignableTables = tables.filter(t => ['AVAILABLE', 'BOOKED'].includes(String(t.status || '').toUpperCase()) || Number(t.id) === Number(res.table_id));
        const tableSelectHtml = ['PENDING', 'CONFIRMED'].includes(rawStatus) && assignableTables.length > 0 ? `
          <select class="inline-input" data-res-table-select="${res.id}" style="flex:1; min-width:130px; font-weight:700; font-size:0.82rem; padding:0.38rem 0.6rem">
            ${assignableTables.map(t => `<option value="${t.id}" ${Number(t.id) === Number(res.table_id) ? 'selected' : ''}>Bàn #${t.tableNumber} (${t.capacity || 4} chỗ)</option>`).join('')}
          </select>
        ` : '';

        let confirmBtnHtml = '';
        let checkinBtnHtml = '';
        let cancelBtnHtml = '';

        if (rawStatus === 'PENDING') {
          confirmBtnHtml = `<button class="btn btn-primary btn-small res-action-btn" data-action="reservation-confirm" data-id="${res.id}" title="Xác nhận đơn đặt bàn"><i class="fa-solid fa-check"></i> Duyệt</button>`;
          checkinBtnHtml = `<button class="btn btn-primary btn-small res-action-btn" style="background:#16a34a" data-action="reservation-checkin" data-id="${res.id}" title="Check-in nhận bàn cho khách"><i class="fa-solid fa-user-check"></i> Nhận bàn</button>`;
          cancelBtnHtml = `<button class="btn btn-danger btn-small res-action-btn" data-action="reservation-cancel" data-id="${res.id}" title="Hủy lịch đặt bàn"><i class="fa-solid fa-xmark"></i> Hủy</button>`;
        } else if (rawStatus === 'CONFIRMED') {
          checkinBtnHtml = `<button class="btn btn-primary btn-small res-action-btn" style="background:#16a34a" data-action="reservation-checkin" data-id="${res.id}" title="Check-in nhận bàn cho khách"><i class="fa-solid fa-user-check"></i> Nhận bàn</button>`;
          cancelBtnHtml = `<button class="btn btn-danger btn-small res-action-btn" data-action="reservation-cancel" data-id="${res.id}" title="Hủy lịch đặt bàn"><i class="fa-solid fa-xmark"></i> Hủy</button>`;
        }

        return `
          <article class="reservation-card" style="display:flex; flex-direction:column; height:100%">
            <div class="reservation-header">
              <div class="guest-info">
                <div class="guest-avatar">${initials}</div>
                <div>
                  <div class="guest-name">#${res.id} • ${escapeHtml(res.guestName || 'Khách')}</div>
                  <div class="guest-phone"><i class="fa-solid fa-phone"></i> ${escapeHtml(res.guestPhone || '-')}</div>
                  <div style="margin-top:0.25rem">${memberBadgeHtml}</div>
                </div>
              </div>
              ${RESERVATION_STATUS_MAP[rawStatus] || rawStatus}
            </div>

            <div class="reservation-meta">
              <div class="res-meta-item">
                <span class="res-meta-label">Thời gian hẹn</span>
                <span class="res-meta-value"><i class="fa-regular fa-clock text-primary"></i> ${formatDateTime(res.reservationTime)}</span>
              </div>
              <div class="res-meta-item">
                <span class="res-meta-label">Vị trí & Khách</span>
                <span class="res-meta-value"><i class="fa-solid fa-chair text-amber"></i> Bàn ${tableStr} • 👥 ${formatNumber(res.numberOfGuests ?? 1)}</span>
              </div>
            </div>

            ${res.note ? `<div class="res-note-box"><i class="fa-solid fa-quote-left"></i><span>"${escapeHtml(res.note)}"</span></div>` : ''}

            <div class="row-actions" style="margin-top:auto; padding-top:0.65rem; display:flex; gap:0.45rem; flex-wrap:wrap; justify-content:flex-end; align-items:center">
              ${tableSelectHtml}
              ${confirmBtnHtml}
              ${checkinBtnHtml}
              ${cancelBtnHtml}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}
