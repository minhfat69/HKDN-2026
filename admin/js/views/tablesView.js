// Modular Tables View (Giao diện Quản lý Bàn ăn Chuẩn Template Order & Đồng bộ Đặt bàn Thành viên/Vãng lai theo SĐT)
import { TABLE_STATUS_MAP } from '../config.js';
import { formatCurrency, formatDateTime, formatNumber, escapeHtml, statusChip, paymentStatusClass } from '../utils.js';

function resolveReservationCustomerInfo(res, allUsers = []) {
  if (!res) return null;
  const cleanPhone = String(res.guestPhone || res.User?.phone || '').trim();
  const matchedUser = res.User || allUsers.find(u =>
    (res.user_id && String(u.id) === String(res.user_id)) ||
    (cleanPhone && String(u.phone || '').trim() === cleanPhone)
  );

  if (matchedUser || res.isMember) {
    const tier = matchedUser?.tier || res.memberTier || matchedUser?.membershipTier || 'MEMBER';
    const points = matchedUser?.points ?? res.memberPoints ?? 0;
    return {
      isMember: true,
      user_id: matchedUser?.id || res.user_id || null,
      fullName: matchedUser?.fullName || res.guestName || 'Thành viên',
      phone: cleanPhone || matchedUser?.phone || '-',
      tier,
      points,
      badgeHtml: `<span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800; border:1px solid #fde68a"><i class="fa-solid fa-crown"></i> Thành viên (${escapeHtml(tier)} • ${formatNumber(points)}đ)</span>`
    };
  }

  return {
    isMember: false,
    user_id: null,
    fullName: res.guestName || 'Khách đặt bàn',
    phone: cleanPhone || '-',
    tier: null,
    points: 0,
    badgeHtml: `<span class="badge-inline" style="background:#f1f5f9; color:#475569; font-weight:700"><i class="fa-regular fa-user"></i> Khách vãng lai</span>`
  };
}

export function renderTablesFloorGrid(tables, activeFilter = 'ALL', orders = [], reservations = []) {
  if (!tables || tables.length === 0) {
    return `<div class="empty-state"><strong>Chưa có dữ liệu bàn ăn</strong><p>Bấm Thêm bàn ăn để tạo mới hoặc nạp dữ liệu hàng loạt.</p></div>`;
  }

  let filtered = tables;
  if (activeFilter && activeFilter !== 'ALL') {
    filtered = tables.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === activeFilter);
  }

  if (filtered.length === 0) {
    return `<div class="empty-state"><strong>Không tìm thấy bàn ăn ở trạng thái này</strong></div>`;
  }

  const now = new Date();
  const allOrders = Array.isArray(orders) && orders.length ? orders : (window.__ordersList || []);
  const allRes = Array.isArray(reservations) && reservations.length ? reservations : (window.__reservationsList || []);
  const allUsers = Array.isArray(window.__usersList) ? window.__usersList : [];

  const baseUrl = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:3000';

  return `
    <div class="orders-grid tables-card-grid">
      ${filtered.map(table => {
        const st = String(table.calculatedStatus || table.status || 'AVAILABLE').toUpperCase();
        const info = TABLE_STATUS_MAP[st] || TABLE_STATUS_MAP.AVAILABLE;

        const tableIdStr = String(table.id);
        const tableNumStr = String(table.tableNumber);

        // 1. Find active UNPAID order on this table
        const activeOrder = allOrders.find(o => {
          const oTableId = String(o.table_id ?? o.tableId ?? o.RestaurantTable?.id ?? o.table?.id ?? '');
          const oTableNum = String(o.RestaurantTable?.tableNumber ?? o.table?.tableNumber ?? o.tableNumber ?? '');
          const matches = (oTableId === tableIdStr || oTableNum === tableNumStr) && (oTableId !== '' || oTableNum !== '');
          const isUnpaid = String(o.paymentStatus || 'UNPAID').toUpperCase() !== 'PAID';
          const notDone = !['COMPLETED', 'CANCELLED'].includes(String(o.status || '').toUpperCase());
          return matches && isUnpaid && notDone;
        });

        // 2. Find active reservation on this table (including PENDING, CONFIRMED, CHECKED_IN)
        const activeRes = table.activeReservation || allRes.find(r => {
          const rTableId = String(r.table_id ?? r.table?.id ?? '');
          const rTableNum = String(r.table?.tableNumber ?? '');
          const matches = (rTableId === tableIdStr || rTableNum === tableNumStr) && (rTableId !== '' || rTableNum !== '');
          const isActiveRes = ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'ARRIVED'].includes(String(r.status || '').toUpperCase());
          return matches && isActiveRes;
        });

        const resCustInfo = resolveReservationCustomerInfo(activeRes, allUsers);

        // 3. Customer info & duration calculation
        let customerDisplay = 'Bàn sẵn sàng đón khách';
        let customerIcon = 'fa-chair';
        let durationText = '';

        if (st === 'OCCUPIED') {
          customerIcon = 'fa-user-group';
          if (activeOrder) {
            customerDisplay = activeOrder.User?.fullName || (activeOrder.user_id ? `Thành viên #${activeOrder.user_id}` : (resCustInfo ? resCustInfo.fullName : 'Khách tại bàn'));
          } else if (resCustInfo) {
            customerDisplay = `${resCustInfo.fullName} (${resCustInfo.phone})`;
          } else {
            customerDisplay = 'Khách đang dùng bữa';
          }

          const startTime = table.occupiedSince ? new Date(table.occupiedSince) : (activeOrder?.createdAt ? new Date(activeOrder.createdAt) : null);
          if (startTime && !isNaN(startTime)) {
            const diffMins = Math.max(0, Math.floor((now - startTime) / 60000));
            const timeStr = diffMins >= 60 ? `${Math.floor(diffMins / 60)}h ${diffMins % 60}p` : `${diffMins}p`;
            durationText = `⏱️ ${timeStr}`;
          } else if (table.timeUsed) {
            durationText = `⏱️ ${table.timeUsed}`;
          } else {
            durationText = '⏱️ Đang phục vụ';
          }
        } else if (st === 'BOOKED' || activeRes) {
          customerIcon = 'fa-calendar-check';
          if (activeRes) {
            customerDisplay = `${activeRes.guestName || 'Khách đặt'} (${activeRes.numberOfGuests || table.capacity || 2} khách)`;
            durationText = `📅 ${formatDateTime(activeRes.reservationTime)}`;
          } else {
            customerDisplay = 'Đã có lịch hẹn đặt trước';
            durationText = '📅 Đã đặt trước';
          }
        } else if (st === 'CLEANING') {
          customerIcon = 'fa-broom';
          customerDisplay = 'Chờ nhân viên dọn dẹp vệ sinh';
          durationText = '🟣 Cần dọn';
        } else {
          customerIcon = 'fa-circle-check';
          customerDisplay = `Bàn trống • Sức chứa ${table.capacity || 4} chỗ`;
          durationText = '🟢 Sẵn sàng';
        }

        let stepIdx = 0;
        if (st === 'AVAILABLE') stepIdx = 0;
        if (st === 'BOOKED') stepIdx = 1;
        if (st === 'OCCUPIED') stepIdx = 2;
        if (st === 'CLEANING') stepIdx = 3;

        const qrCodeString = table.qrCode || `TABLE_${table.tableNumber}`;
        const targetUrl = `${baseUrl}/customer/menu.html?qr=${encodeURIComponent(qrCodeString)}&table=${table.tableNumber}&tableId=${table.id}`;
        const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(targetUrl)}`;

        const orderItems = activeOrder?.OrderItems || [];
        const itemsCount = orderItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
        const orderTotal = activeOrder ? (activeOrder.finalPrice ?? activeOrder.totalPrice) : 0;
        const paymentStatus = activeOrder ? String(activeOrder.paymentStatus || 'UNPAID').toUpperCase() : 'NONE';
        const orderStatus = activeOrder ? String(activeOrder.status || 'PENDING').toUpperCase() : '';

        return `
          <article class="order-card table-card-premium status-border-${st.toLowerCase()}">
            <!-- Card Header -->
            <div class="order-card-head">
              <div class="order-id-badge">
                <i class="fa-solid fa-chair"></i> Bàn #${table.tableNumber}
              </div>
              <span class="table-pill-clean ${info.cssClass}">
                ${info.label}
              </span>
            </div>

            <!-- Customer & Occupancy Info Row -->
            <div class="order-customer-info">
              <div style="display:flex; align-items:center; gap:0.4rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:65%">
                <i class="fa-solid ${customerIcon}" style="color:#004ac6"></i>
                <strong style="font-size:0.92rem; color:#111c2d">${escapeHtml(customerDisplay)}</strong>
              </div>
              <span class="muted" style="font-size:0.8rem; font-weight:700">${escapeHtml(durationText)}</span>
            </div>

            <!-- Đồng bộ Đặt bàn: Hiển thị rõ Khách Thành Viên hay Khách Vãng Lai dựa trên SĐT -->
            ${activeRes && resCustInfo ? `
              <div style="padding:0.55rem 0.75rem; border-radius:10px; background:${resCustInfo.isMember ? '#fffbeb' : '#f8fafc'}; border:1px solid ${resCustInfo.isMember ? '#fde68a' : '#e2e8f0'}; font-size:0.8rem; display:flex; flex-direction:column; gap:0.25rem">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem; flex-wrap:wrap">
                  <span><i class="fa-solid fa-phone" style="color:#004ac6"></i> SĐT đặt bàn: <strong>${escapeHtml(resCustInfo.phone)}</strong></span>
                  ${resCustInfo.badgeHtml}
                </div>
                <div style="color:#475569; font-size:0.78rem">
                  ${resCustInfo.isMember
                    ? `Đã đồng bộ tài khoản: <strong>${escapeHtml(resCustInfo.fullName)}</strong> (Tự động tích điểm & giảm giá hạng ${escapeHtml(resCustInfo.tier)})`
                    : `Số điện thoại này chưa đăng ký tài khoản thành viên (Phục vụ theo diện Khách vãng lai)`}
                </div>
              </div>
            ` : ''}

            <!-- Table Lifecycle Stepper -->
            <div class="order-stepper table-stepper" title="Tiến trình trạng thái bàn">
              <div class="order-stepper-line"></div>
              <div class="order-step ${stepIdx >= 0 ? 'done' : ''}" title="Trống (Sẵn sàng)"><i class="fa-solid fa-chair"></i></div>
              <div class="order-step ${stepIdx >= 1 ? 'done' : ''}" title="Đặt trước (Booked)"><i class="fa-solid fa-calendar-check"></i></div>
              <div class="order-step ${stepIdx >= 2 ? 'done' : ''}" title="Đang ăn (Occupied)"><i class="fa-solid fa-utensils"></i></div>
              <div class="order-step ${stepIdx >= 3 ? 'done' : ''}" title="Cần dọn (Cleaning)"><i class="fa-solid fa-broom"></i></div>
            </div>

            <!-- Order Summary Box -->
            ${activeOrder ? `
              <div class="order-summary-box">
                <div>
                  <span class="muted" style="font-size:0.82rem; display:block">Đơn #${activeOrder.id} • <strong>${itemsCount} món</strong></span>
                  ${statusChip(paymentStatusClass(paymentStatus), 'Chưa thanh toán')}
                </div>
                <div class="order-total-price">${formatCurrency(orderTotal)}</div>
              </div>
            ` : ''}

            <!-- Action Buttons Row -->
            <div class="row-actions" style="gap:0.4rem; justify-content:space-between; align-items:center; flex-wrap:wrap">
              <select class="table-quick-select" data-action="table-status-select" data-id="${table.id}" style="font-weight:700; flex:1; min-width:115px" title="Đổi trạng thái bàn">
                <option value="AVAILABLE" ${st === 'AVAILABLE' ? 'selected' : ''}>🟢 Bàn trống</option>
                <option value="BOOKED" ${st === 'BOOKED' ? 'selected' : ''}>🔵 Đặt trước</option>
                <option value="OCCUPIED" ${st === 'OCCUPIED' ? 'selected' : ''}>🟡 Đang ăn</option>
                <option value="CLEANING" ${st === 'CLEANING' ? 'selected' : ''}>🟣 Cần dọn</option>
              </select>

              <button type="button" class="btn btn-secondary btn-small" data-action="create-order-for-table" data-table-id="${table.id}" data-user-id="${resCustInfo?.user_id || ''}" data-phone="${escapeHtml(resCustInfo?.phone || '')}" style="font-weight:700; padding:0.4rem 0.65rem" title="Tạo đơn gọi món cho bàn này (Tự động đồng bộ khách đặt bàn)">
                <i class="fa-solid fa-utensils"></i> Gọi món
              </button>

              <button type="button" class="btn btn-primary btn-small" data-action="open-table-qr-modal" data-id="${table.id}" data-number="${table.tableNumber}" data-capacity="${table.capacity || 4}" data-code="${escapeHtml(qrCodeString)}" data-url="${escapeHtml(targetUrl)}" data-img="${escapeHtml(qrImageSrc)}" style="font-weight:800; padding:0.4rem 0.7rem" title="Mở mã QR bàn">
                <i class="fa-solid fa-qrcode"></i> QR
              </button>

              ${activeOrder && paymentStatus !== 'PAID' && ['READY', 'COMPLETED'].includes(orderStatus) ? `
                <button class="btn btn-primary btn-small" data-action="open-admin-checkout" data-id="${activeOrder.id}" data-table="${table.tableNumber}" data-customer="${escapeHtml(customerDisplay)}" data-amount="${orderTotal}" data-items="${itemsCount}" data-status="${orderStatus}" style="font-weight:800; background:#15803d" title="Thanh toán đơn hàng">
                  <i class="fa-solid fa-credit-card"></i> Thu tiền
                </button>
              ` : ''}

              <button class="btn btn-ghost btn-small" data-action="toggle-table-detail" data-id="${table.id}" title="Xem chi tiết bàn"><i class="fa-solid fa-chevron-down"></i></button>
            </div>

            <!-- Collapsible Table Detail Accordion Drawer -->
            <div class="mini-card hidden" data-table-detail="${table.id}">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; padding-bottom:0.4rem; border-bottom:1px dashed #cbd5e1">
                <div><strong>Mã Bàn:</strong> <span class="badge-inline" style="background:#e0f2fe; color:#004ac6; font-weight:800"><i class="fa-solid fa-chair"></i> Bàn #${table.tableNumber}</span></div>
                <div style="font-size:0.82rem; color:#64748b">👥 Sức chứa: <strong>${table.capacity || 4} người</strong></div>
              </div>

              ${activeRes && resCustInfo ? `
                <div style="margin-top:0.4rem; margin-bottom:0.6rem">
                  <h4 class="mini-card-title" style="margin:0 0 0.4rem 0"><i class="fa-solid fa-calendar-check"></i> Đồng bộ dữ liệu Đặt bàn trước (#${activeRes.id})</h4>
                  <div class="info-list">
                    <div class="info-row" style="padding:0.3rem 0.5rem"><span>Khách đặt:</span><strong>${escapeHtml(activeRes.guestName || '-')}</strong></div>
                    <div class="info-row" style="padding:0.3rem 0.5rem"><span>Số điện thoại:</span><strong>${escapeHtml(resCustInfo.phone)}</strong></div>
                    <div class="info-row" style="padding:0.3rem 0.5rem"><span>Phân loại khách:</span>${resCustInfo.badgeHtml}</div>
                    ${resCustInfo.isMember ? `<div class="info-row" style="padding:0.3rem 0.5rem"><span>Tài khoản Thành viên:</span><strong style="color:#004ac6">${escapeHtml(resCustInfo.fullName)} (#${resCustInfo.user_id}) • ${formatNumber(resCustInfo.points)} điểm</strong></div>` : ''}
                    <div class="info-row" style="padding:0.3rem 0.5rem"><span>Thời gian hẹn:</span><strong>${formatDateTime(activeRes.reservationTime)}</strong></div>
                    <div class="info-row" style="padding:0.3rem 0.5rem"><span>Số lượng khách:</span><strong>${activeRes.numberOfGuests || table.capacity || 2} người</strong></div>
                  </div>
                </div>
              ` : ''}

              ${activeOrder ? `
                <div style="margin-top:0.4rem">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem">
                    <h4 class="mini-card-title" style="margin:0"><i class="fa-solid fa-receipt"></i> Đơn hàng #${activeOrder.id} (${itemsCount} món)</h4>
                    <span class="badge-inline" style="font-size:0.75rem; background:#f1f5f9">${activeOrder.status}</span>
                  </div>
                  <div class="info-list" style="max-height:160px; overflow-y:auto">
                    ${orderItems.map(item => `
                      <div class="info-row" style="padding:0.3rem 0.5rem">
                        <span>${escapeHtml(item.Product?.name || `#${item.product_id}`)} x${item.quantity}</span>
                        <strong>${formatCurrency(item.totalPrice || 0)}</strong>
                      </div>
                    `).join('')}
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem; padding-top:0.4rem; border-top:1px solid #f1f5f9">
                    <strong style="font-size:0.85rem">Tổng tiền đơn:</strong>
                    <strong style="color:#004ac6; font-size:1rem">${formatCurrency(orderTotal)}</strong>
                  </div>
                </div>
              ` : !activeRes ? `
                <div style="font-size:0.84rem; color:#64748b; padding:0.4rem 0; text-align:center">
                  <i class="fa-solid fa-circle-check text-success"></i> Bàn đang trống và sẵn sàng đón khách
                </div>
              ` : ''}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}
