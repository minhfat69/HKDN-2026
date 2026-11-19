import { TOKEN_KEY, USER_KEY, API_BASE_URL, RESERVATION_STATUS_MAP } from './js/config.js';
import { formatCurrency, formatDateTime, formatNumber, escapeHtml, userInitials, statusChip, tableStatusClass, orderStatusClass, paymentStatusClass, reservationStatusClass } from './js/utils.js';
import { api } from './js/api.js';
import { renderReservationsGrid } from './js/views/reservationsView.js';
import { renderOrdersGrid, generatePayOSQRUrl, getOrderTableInfo } from './js/views/ordersView.js';
import { renderTablesFloorGrid } from './js/views/tablesView.js';
import { renderProductsGrid } from './js/views/productsView.js';
import { renderUsersGrid } from './js/views/usersView.js';
import { renderPaymentsGrid } from './js/views/paymentsView.js';

const VIEW_META = {
  overview: {
    title: 'Dashboard',
    description: 'Theo dõi nhanh tình trạng hệ thống, doanh thu và số lượng bản ghi đang quản lý.'
  },
  users: {
    title: 'Người dùng',
    description: 'Quản lý tài khoản, vai trò, điểm tích lũy và trạng thái đăng nhập.'
  },
  categories: {
    title: 'Danh mục món',
    description: 'Tạo, sửa và xóa nhóm món ăn hiển thị trên menu.'
  },
  products: {
    title: 'Sản phẩm',
    description: 'Quản lý món ăn, giá bán, tồn kho, ảnh và liên kết danh mục.'
  },
  tables: {
    title: 'Bàn ăn',
    description: 'Theo dõi trạng thái bàn, nạp danh sách bàn hàng loạt và cập nhật nhanh trạng thái.'
  },
  reservations: {
    title: 'Đặt bàn',
    description: 'Theo dõi lịch đặt, xác nhận nhận bàn và hủy đặt bàn khi cần.'
  },
  orders: {
    title: 'Đơn hàng',
    description: 'Xem đơn chi tiết, đổi trạng thái, thanh toán và xóa đơn không hợp lệ.'
  },
  reviews: {
    title: 'Đánh giá',
    description: 'Duyệt phản hồi khách hàng và xóa đánh giá không phù hợp.'
  },
  payments: {
    title: 'Thanh toán & Giao dịch',
    description: 'Quản lý lịch sử giao dịch thanh toán, mã giao dịch và phương thức thanh toán.'
  },
  inventory: {
    title: 'Kho Barcode & Định lượng Recipe',
    description: 'Quét mã vạch nhập kho theo lô (MFG/EXP), gợi ý xuất kho FEFO và thiết lập định lượng công thức tự động trừ kho.'
  },
  vouchers: {
    title: 'Khuyến mãi & Voucher',
    description: 'Quản lý các chương trình mã giảm giá theo phần trăm hoặc số tiền cố định.'
  },
  shifts: {
    title: 'Ca Thu ngân, Hủy món PIN & Hóa đơn VAT',
    description: 'Mở/Đóng ca đối soát tiền mặt, duyệt Hủy món/Hao hụt (Void/Waste) bằng mã PIN Quản lý và in hóa đơn VAT 8%.'
  },
  kitchen: {
    title: 'Màn hình Bếp (KDS) & Chế biến món',
    description: 'Theo dõi đơn hàng cần nấu theo thời gian thực, chuyển trạng thái Đang làm / Hoàn thành, báo hết món khẩn cấp và hủy món đột xuất ngay tại khu vực bếp.'
  },
  stats: {
    title: 'Báo cáo Doanh thu, Lợi nhuận P&L & Dự báo',
    description: 'Phân tích doanh thu, giá vốn nguyên liệu (COGS), chi phí hao hụt (Waste), lợi nhuận ròng P&L và dự báo món bán chạy.'
  }
};

const NAV_ICONS = {
  overview: 'fa-gauge-high',
  users: 'fa-users',
  categories: 'fa-folder-open',
  products: 'fa-bowl-food',
  tables: 'fa-table',
  reservations: 'fa-calendar-check',
  orders: 'fa-receipt',
  payments: 'fa-credit-card',
  reviews: 'fa-star',
  inventory: 'fa-boxes-stacked',
  vouchers: 'fa-ticket',
  shifts: 'fa-cash-register',
  kitchen: 'fa-fire-burner',
  stats: 'fa-chart-line'
};

const ENTITY_CONFIGS = {
  users: {
    endpoint: '/api/users',
    searchKey: 'search',
    createLabel: 'Thêm người dùng',
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: 'fullName', label: 'Họ tên', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
      { name: 'username', label: 'Tên đăng nhập', type: 'text', required: true },
      { name: 'password', label: 'Mật khẩu', type: 'password', requiredOnCreate: true, helper: 'Bỏ trống khi chỉnh sửa người dùng hiện tại.' },
      { name: 'avatar', label: 'Avatar', type: 'image' },
      { name: 'points', label: 'Điểm tích lũy', type: 'number', min: 0 },
      { name: 'tier', label: 'Hạng thành viên', type: 'select', options: ['MEMBER', 'SILVER', 'GOLD', 'VIP'] },
      { name: 'role', label: 'Vai trò', type: 'select', options: ['CUSTOMER', 'HOST', 'STAFF', 'KITCHEN', 'ADMIN'] },
      { name: 'pinCode', label: 'Mã PIN Quản lý (Duyệt hủy món UC23.3)', type: 'text', placeholder: 'VD: 123456' },
      { name: 'status', label: 'Trạng thái', type: 'select', options: ['ACTIVE', 'BLOCKED'] }
    ],
    columns: [
      { label: 'Họ tên', render: row => row.fullName || '-' },
      { label: 'Tài khoản', render: row => row.username || '-' },
      { label: 'Liên hệ', render: row => [row.phone, row.email].filter(Boolean).join(' • ') || '-' },
      { label: 'Vai trò', render: row => statusChip(row.role, row.role) },
      { label: 'Hạng thẻ', render: row => statusChip(row.tier || 'MEMBER', row.tier || 'MEMBER') },
      { label: 'Trạng thái', render: row => statusChip(row.status, row.status) },
      { label: 'Điểm', render: row => formatNumber(row.points ?? 0) }
    ],
    payload: row => ({
      fullName: row.fullName || '',
      email: row.email || '',
      phone: row.phone || '',
      username: row.username || '',
      avatar: row.avatar || '',
      points: row.points ?? 0,
      tier: row.tier || 'MEMBER',
      pinCode: row.pinCode || '',
      role: row.role || 'CUSTOMER',
      status: row.status || 'ACTIVE'
    })
  },
  categories: {
    endpoint: '/api/categories',
    searchKey: 'search',
    createLabel: 'Thêm danh mục',
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
      { name: 'image', label: 'Ảnh', type: 'image' }
    ],
    columns: [
      { label: 'Tên', render: row => row.name || '-' },
      { label: 'Mô tả', render: row => row.description || '-' },
      { label: 'Ảnh', render: row => row.image ? `<span class="badge-inline">Có ảnh</span>` : '<span class="muted">Chưa có</span>' },
      { label: 'Số món', render: row => formatNumber(row.productCount ?? 0) }
    ],
    payload: row => ({
      name: row.name || '',
      description: row.description || '',
      image: row.image || ''
    })
  },
  products: {
    endpoint: '/api/products',
    searchKey: 'search',
    createLabel: 'Thêm sản phẩm',
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: 'name', label: 'Tên món', type: 'text', required: true },
      { name: 'description', label: 'Mô tả', type: 'textarea' },
      { name: 'price', label: 'Giá bán (₫)', type: 'number', required: true, min: 0, step: '0.01' },
      { name: 'costPrice', label: 'Giá vốn nguyên liệu dự kiến (₫ - Tính P&L)', type: 'number', min: 0, step: '0.01' },
      { name: 'stock', label: 'Số lượng tồn kho (suất)', type: 'number', min: 0 },
      { name: 'isAvailable', label: 'Đang bán', type: 'checkbox' },
      { name: 'isSecretMenu', label: '👑 Món thuộc Menu ẩn VIP (Chỉ khách hạng VIP thấy - UC25)', type: 'checkbox' },
      { name: 'category_id', label: 'Danh mục', type: 'select', options: state => (state.data.categories || []).map(category => ({ value: category.id, label: `${category.name} (#${category.id})` })) },
      { name: 'image', label: 'Ảnh', type: 'image' }
    ],
    columns: [
      { label: 'Tên món', render: row => `${row.name || '-'}${row.isSecretMenu ? ' 👑' : ''}` },
      { label: 'Danh mục', render: row => categoryLabel(row.category_id) },
      { label: 'Giá bán', render: row => formatCurrency(row.price) },
      { label: 'Tồn kho', render: row => formatNumber(row.stock ?? 0) },
      { label: 'Sẵn sàng', render: row => statusChip(row.isAvailable ? 'AVAILABLE' : 'BLOCKED', row.isAvailable ? 'Có' : 'Không') }
    ],
    payload: row => ({
      name: row.name || '',
      description: row.description || '',
      price: row.price ?? 0,
      costPrice: row.costPrice ?? 0,
      stock: row.stock ?? 0,
      isAvailable: row.isAvailable !== false,
      isSecretMenu: Boolean(row.isSecretMenu),
      category_id: row.category_id || state.data.categories?.[0]?.id || '',
      image: row.image || ''
    })
  },
  tables: {
    endpoint: '/api/tables',
    searchKey: 'search',
    createLabel: 'Thêm bàn ăn',
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: 'tableNumber', label: 'Số bàn', type: 'number', required: true, min: 1 },
      { name: 'capacity', label: 'Sức chứa (người)', type: 'number', required: true, min: 1, value: 4 },
      { name: 'qrCode', label: 'Mã QR Code Bàn', type: 'text', helper: 'Ví dụ: T1-001 (Bỏ trống tự tạo)' },
      { name: 'status', label: 'Trạng thái', type: 'select', options: ['AVAILABLE', 'OCCUPIED', 'BOOKED', 'CLEANING'] }
    ],
    columns: [
      { label: 'Số bàn', render: row => `#${row.tableNumber ?? row.id}` },
      { label: 'QR Code', render: row => row.qrCode || '-' },
      { label: 'Sức chứa', render: row => formatNumber(row.capacity ?? 0) },
      { label: 'Trạng thái', render: row => statusChip(tableStatusClass(row.calculatedStatus || row.status), row.calculatedStatus || row.status) },
      { label: 'Khách', render: row => row.guestCount ? formatNumber(row.guestCount) : '-' },
      { label: 'Thời gian dùng', render: row => row.timeUsed || '-' }
    ]
  },
  reservations: {
    endpoint: '/api/reservations',
    searchKey: 'search',
    createLabel: 'Thêm đặt bàn',
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    customCreateMode: 'reservation',
    columns: [
      { label: 'Khách', render: row => row.guestName || '-' },
      { label: 'SĐT', render: row => row.guestPhone || '-' },
      { label: 'Thời gian', render: row => formatDateTime(row.reservationTime) },
      { label: 'Số khách', render: row => formatNumber(row.numberOfGuests ?? 0) },
      { label: 'Bàn', render: row => row.table?.tableNumber ? `#${row.table.tableNumber}` : row.table_id ? `#${row.table_id}` : '-' },
      { label: 'Trạng thái', render: row => RESERVATION_STATUS_MAP[String(row.status || 'PENDING').toUpperCase()] || statusChip(reservationStatusClass(row.status), row.status) }
    ]
  },
  orders: {
    endpoint: '/api/orders',
    searchKey: 'search',
    createLabel: 'Tạo đơn hàng',
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    customCreateMode: 'order',
    columns: [
      { label: 'Mã đơn', render: row => `#${row.id}` },
      { label: 'Khách', render: row => row.User?.fullName || row.user_id ? `${row.User?.fullName || 'Khách'} (#${row.user_id})` : 'Khách vãng lai' },
      { 
        label: 'Bàn', 
        render: row => {
          const tInfo = getOrderTableInfo(row, state.data.tables);
          return `<span class="badge-inline" style="background:#e0f2fe; color:#004ac6; font-weight:700"><i class="fa-solid ${tInfo.isTakeaway ? 'fa-bag-shopping' : 'fa-chair'}"></i> ${tInfo.label}</span>`;
        } 
      },
      { label: 'Tổng tiền', render: row => formatCurrency(row.finalPrice ?? row.totalPrice) },
      { label: 'Thanh toán', render: row => statusChip(paymentStatusClass(row.paymentStatus), row.paymentStatus) },
      { label: 'Trạng thái', render: row => statusChip(orderStatusClass(row.status), row.status) }
    ]
  },
  reviews: {
    endpoint: '/api/reviews?page=1&limit=200&includeHidden=true',
    searchKey: 'search',
    createLabel: 'Làm mới danh sách',
    allowCreate: false,
    allowEdit: false,
    allowDelete: true,
    columns: [
      { label: 'Người đánh giá', render: row => row.user?.fullName || row.phone || '-' },
      { label: 'Món', render: row => row.dish_name || '-' },
      { label: 'Nội dung', render: row => row.content || '-' },
      { label: 'Phản hồi Nhà hàng', render: row => row.reply || 'Chưa phản hồi' },
      { label: 'Số sao', render: row => '★'.repeat(row.rating || 0) },
      { label: 'Ngày tạo', render: row => formatDateTime(row.created_at || row.createdAt) }
    ]
  },
  payments: {
    endpoint: '/api/payments',
    searchKey: 'search',
    createLabel: 'Làm mới danh sách',
    allowCreate: false,
    allowEdit: false,
    allowDelete: true,
    columns: [
      { label: 'Mã GD (Hệ thống)', render: row => row.transactionCode || `#PAY-${row.id}` },
      { label: 'Mã PayOS', render: row => {
          const matchNote = row.Order?.note?.match(/\[PAYOS:(\d+)\]/);
          const matchTxn = row.transactionCode?.match(/PAYOS-(\d+)/);
          const code = matchNote ? matchNote[1] : (matchTxn ? matchTxn[1] : null);
          return code ? `<span class="badge-inline" style="background:#e0f2fe; color:#0284c7; font-weight:800"><i class="fa-solid fa-qrcode"></i> ${code}</span>` : '<span class="muted">-</span>';
        }
      },
      { label: 'Mã đơn', render: row => row.Order ? `#${row.Order.id}` : row.order_id ? `#${row.order_id}` : '-' },
      { label: 'Số tiền', render: row => formatCurrency(row.amount) },
      { label: 'Phương thức', render: row => statusChip(row.paymentMethod, row.paymentMethod) },
      { label: 'Trạng thái', render: row => statusChip(row.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED', row.status) },
      { label: 'Khách hàng', render: row => row.Order?.User?.fullName || 'Khách vãng lai' },
      { label: 'Thời gian', render: row => formatDateTime(row.paidAt || row.created_at) }
    ]
  }
};

const app = document.getElementById('app');
const state = {
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: readJson(USER_KEY),
  activeView: 'overview',
  loading: false,
  modal: null,
  toast: [],
  data: {
    users: [],
    categories: [],
    products: [],
    tables: [],
    reservations: [],
    orders: [],
    payments: [],
    reviews: [],
    inventory: [],
    recipes: [],
    vouchers: [],
    currentShift: null,
    pnl: null,
    stats: null
  },
  filters: {
    users: '',
    categories: '',
    products: '',
    tables: '',
    reservations: '',
    orders: '',
    payments: '',
    reviews: ''
  },
  viewModes: {
    products: 'grid',
    categories: 'grid',
    tables: 'floor',
    reservations: 'cards',
    orders: 'cards',
    payments: 'cards',
    users: 'grid',
    reviews: 'cards'
  },
  activeTabs: {
    products: 'ALL',
    tables: 'ALL',
    reservations: 'ALL',
    orders: 'ALL',
    payments: 'ALL',
    users: 'ALL',
    reviews: 'ALL'
  },
  statsQuery: {
    type: 'day',
    date: ''
  }
};

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function categoryLabel(categoryId) {
  const category = (state.data.categories || []).find(item => String(item.id) === String(categoryId));
  return category ? `${category.name} (#${category.id})` : categoryId ? `#${categoryId}` : '-';
}

function toast(type, title, text) {
  state.toast.push({ id: crypto.randomUUID(), type, title, text });
  render();
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    state.toast.shift();
    render();
  }, 3200);
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const result = await api('/api/upload/image', { method: 'POST', body: formData });
  return result.imageUrl;
}

function getRoleRoute(role) {
  const normalized = String(role || '').toUpperCase();
  if (normalized === 'ADMIN') return 'admin';
  if (normalized === 'STAFF') return 'staff';
  if (normalized === 'KITCHEN') return 'kitchen';
  if (normalized === 'HOST') return 'host';
  return null;
}

function redirectByRole(role) {
  const route = getRoleRoute(role);
  const currentPath = window.location.pathname.split('/').pop()?.toLowerCase() || '';

  if (route === 'staff' && !currentPath.endsWith('staff.html')) {
    window.location.assign('./staff.html');
    return true;
  }

  if (route === 'host' && !currentPath.endsWith('host.html')) {
    window.location.assign('./host.html');
    return true;
  }

  if (route === 'kitchen' && !currentPath.endsWith('kitchen.html')) {
    window.location.assign('./kitchen.html');
    return true;
  }

  if (route === 'admin' && currentPath && !currentPath.endsWith('index.html')) {
    window.location.assign('./index.html');
    return true;
  }

  return false;
}

async function boot() {
  if (!state.token) {
    render();
    return;
  }

  const role = String(state.user?.role || '').toUpperCase();
  if (role === 'CUSTOMER') {
    toast('danger', 'Tài khoản không đủ quyền', 'Vui lòng đăng nhập bằng tài khoản quản trị để sử dụng trang quản trị.');
    clearAuth();
    render();
    return;
  }

  if (redirectByRole(role)) {
    return;
  }

  state.loading = true;
  render();

  try {
    await loadAllData();
    if (!['ADMIN', 'STAFF'].includes(role)) {
      toast('danger', 'Tài khoản không đủ quyền', 'Vui lòng đăng nhập bằng tài khoản ADMIN hoặc STAFF để sử dụng trang quản trị.');
      clearAuth();
      render();
      return;
    }
    render();
  } catch (error) {
    handleAuthError(error);
  } finally {
    state.loading = false;
    render();
  }
}

async function loadAllData() {
  const role = String(state.user?.role || '').toUpperCase();
  const statsQuery = new URLSearchParams();
  statsQuery.set('type', state.statsQuery.type);
  if (state.statsQuery.date) {
    statsQuery.set('date', state.statsQuery.date);
  }

  const requests = {
    categories: api('/api/categories'),
    products: api('/api/products'),
    tables: api('/api/tables'),
    reservations: api('/api/reservations'),
    orders: api('/api/orders'),
    payments: api('/api/payments'),
    reviews: api('/api/reviews?page=1&limit=200&includeHidden=true'),
    inventory: api('/api/ops/inventory'),
    recipes: api('/api/ops/recipes'),
    vouchers: api('/api/ops/vouchers'),
    currentShift: api('/api/ops/shifts/current'),
    shiftLogs: api('/api/ops/shifts/logs'),
    pnl: api('/api/ops/analytics/pnl'),
    users: api('/api/users')
  };

  if (role === 'ADMIN') {
    requests.stats = api(`/api/stats?${statsQuery.toString()}`);
  }

  const entries = await Promise.all(
    Object.entries(requests).map(async ([key, promise]) => {
      try {
        return [key, await promise];
      } catch (error) {
        return [key, { __error: error.message }];
      }
    })
  );

  for (const [key, value] of entries) {
    state.data[key] = value;
  }
  if (Array.isArray(state.data.tables)) {
    window.__tablesList = state.data.tables;
  }
  if (Array.isArray(state.data.orders)) {
    window.__ordersList = state.data.orders;
  }
  if (Array.isArray(state.data.reservations)) {
    window.__reservationsList = state.data.reservations;
  }
  if (Array.isArray(state.data.payments)) {
    window.__paymentsList = state.data.payments;
  }
  if (Array.isArray(state.data.users)) {
    window.__usersList = state.data.users;
  }
}

function clearAuth() {
  state.token = '';
  state.user = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function persistAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function handleAuthError(error) {
  if (error?.status === 401 || error?.status === 403) {
    clearAuth();
    toast('danger', 'Phiên đăng nhập hết hạn', 'Vui lòng đăng nhập lại bằng tài khoản quản trị.');
    render();
    return;
  }
  toast('danger', 'Lỗi tải dữ liệu', error.message || 'Không thể tải dữ liệu quản trị.');
}

function render() {
  if (!state.token) {
    app.innerHTML = renderLogin();
    bindLogin();
    renderToasts();
    return;
  }

  const role = String(state.user?.role || '').toUpperCase();
  if (!['ADMIN', 'STAFF'].includes(role)) {
    app.innerHTML = renderNonAdmin();
    renderToasts();
    return;
  }

  const activeEl = document.activeElement;
  let savedFocus = null;
  if (activeEl && activeEl.tagName === 'INPUT' && (activeEl.dataset?.action === 'search-input' || activeEl.id)) {
    savedFocus = {
      id: activeEl.id || '',
      action: activeEl.dataset?.action || '',
      view: activeEl.dataset?.view || '',
      selectionStart: activeEl.selectionStart,
      selectionEnd: activeEl.selectionEnd
    };
  }

  const sidebarSections = role === 'ADMIN'
    ? [
        ['Tổng quan', ['overview']],
        ['Quản lý thực đơn', ['products', 'categories']],
        ['Quản lý Kho & Tồn kho', ['inventory']],
        ['Phục vụ, Đặt bàn & Bếp KDS', ['tables', 'reservations', 'orders', 'kitchen']],
        ['Thanh toán & Thu ngân', ['payments', 'shifts', 'vouchers']],
        ['Khách hàng & Đánh giá', ['users', 'reviews']],
        ['Báo cáo & P&L', ['stats']]
      ]
    : [
        ['Tổng quan', ['overview']],
        ['Quản lý thực đơn', ['products', 'categories']],
        ['Quản lý Kho & Tồn kho', ['inventory']],
        ['Phục vụ, Đặt bàn & Bếp KDS', ['tables', 'reservations', 'orders', 'kitchen']],
        ['Thanh toán & Thu ngân', ['payments', 'shifts', 'vouchers']],
        ['Khách hàng & Đánh giá', ['users', 'reviews']]
      ];

  app.innerHTML = `
    <div class="admin-new-shell">
      <aside class="admin-sidebar-shell">
        <div class="admin-brand-box">
          <div class="admin-brand-badge">
            <div class="admin-brand-logo-wrap">
              <img src="/uploads/logo.png" alt="FutureSushi Logo" class="admin-brand-logo" onerror="this.onerror=null; this.src='uploads/logo.png';" />
            </div>
            <div>
              <h1 class="admin-brand-title">FutureSushi</h1>
              <p class="admin-brand-subtitle">Hệ Thống Quản Lý</p>
            </div>
          </div>
          <div class="admin-system-status">
            <span class="status-pulse-dot"></span>
            <span>Hệ thống trực tuyến</span>
          </div>
        </div>

        <nav class="admin-sidebar-nav" aria-label="Navigation">
          ${sidebarSections.map(([title, views]) => renderSidebarGroup(title, views)).join('')}
        </nav>

        <div class="admin-sidebar-profile">
          <div class="admin-profile-avatar">${escapeHtml(userInitials(state.user))}</div>
          <div class="admin-profile-copy">
            <div class="admin-profile-name">${escapeHtml(state.user?.fullName || state.user?.username || 'Admin')}</div>
            <div class="admin-profile-role">${escapeHtml(state.user?.role || 'ADMIN')}</div>
          </div>
          <button class="admin-logout-button" data-action="logout" title="Đăng xuất khỏi hệ thống">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </aside>

      <main class="admin-content-shell">
        <header class="admin-topbar-shell">
          <div class="admin-topbar-left">
            <div class="admin-breadcrumb">
              <span>Trang chủ</span>
              <i class="fa-solid fa-chevron-right"></i>
              <strong class="current">${escapeHtml(VIEW_META[state.activeView].title)}</strong>
            </div>
          </div>

          <div class="admin-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Tìm kiếm nhanh hệ thống..." value="${escapeHtml(state.filters[state.activeView] || '')}" data-action="search-input" data-view="${state.activeView}" />
          </div>

          <div class="admin-topbar-right">
            <div class="admin-live-clock">
              <i class="fa-regular fa-clock"></i>
              <span>${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="admin-noti-btn" title="Thông báo hệ thống">
              <i class="fa-solid fa-bell"></i>
              <span class="noti-badge"></span>
            </div>
            <div class="admin-topbar-divider"></div>
            <button class="admin-header-cta" data-action="switch-view" data-view="orders">
              <i class="fa-solid fa-bolt"></i>
              POS Gọi Món
            </button>
          </div>
        </header>

        <section class="admin-main-content">
          ${renderActiveView()}
        </section>
      </main>
    </div>
    ${renderModal()}
    <div class="toast-stack">${state.toast.map(renderToast).join('')}</div>
  `;

  bindGlobalEvents();

  if (savedFocus) {
    let restoreEl = null;
    if (savedFocus.id) {
      restoreEl = document.getElementById(savedFocus.id);
    } else if (savedFocus.action === 'search-input') {
      const candidates = app.querySelectorAll(`[data-action="search-input"][data-view="${savedFocus.view}"]`);
      restoreEl = candidates[candidates.length - 1] || candidates[0];
    }
    if (restoreEl) {
      restoreEl.focus();
      try {
        if (typeof savedFocus.selectionStart === 'number') {
          restoreEl.setSelectionRange(savedFocus.selectionStart, savedFocus.selectionEnd);
        }
      } catch (_) {}
    }
  }
}

function renderNonAdmin() {
  return `
    <div class="auth-screen">
      <div class="auth-bg-ambient">
        <div class="auth-blob auth-blob-1"></div>
        <div class="auth-blob auth-blob-2"></div>
      </div>
      <section class="auth-card auth-card-warning" style="text-align:center">
        <div class="auth-warning-icon">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h1 class="auth-title">Tài khoản không đủ quyền</h1>
        <p class="auth-copy">Trang này chỉ mở cho tài khoản có vai trò <strong>ADMIN</strong> hoặc <strong>STAFF</strong>. Vui lòng đăng nhập lại bằng tài khoản phù hợp.</p>
        <button class="btn btn-primary btn-login-submit" data-action="logout" style="margin-top:1.2rem;">
          <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất tài khoản
        </button>
      </section>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="auth-screen">
      <div class="auth-bg-ambient">
        <div class="auth-blob auth-blob-1"></div>
        <div class="auth-blob auth-blob-2"></div>
      </div>
      
      <section class="auth-card">
        <div class="auth-brand-logo">
          <img src="/uploads/logo.png" alt="FutureSushi Logo" onerror="this.onerror=null; this.src='uploads/logo.png';" />
        </div>
        
        <div class="auth-header">
          <h1 class="auth-title">Đăng nhập quản trị</h1>
          <p class="auth-copy">Vui lòng nhập tài khoản để truy cập hệ thống FutureSushi</p>
        </div>

        <form class="auth-form" data-form="login">
          <div class="field">
            <label for="account">Tên đăng nhập hoặc Số điện thoại</label>
            <div class="input-wrapper">
              <input id="account" name="account" type="text" autocomplete="username" required placeholder="Tên đăng nhập / SĐT..." />
              <i class="fa-solid fa-user input-icon"></i>
            </div>
          </div>

          <div class="field">
            <label for="password">Mật khẩu</label>
            <div class="input-wrapper">
              <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="Mật khẩu..." />
              <i class="fa-solid fa-lock input-icon"></i>
              <button type="button" class="btn-toggle-password" id="toggle-pw" title="Ẩn/Hiện mật khẩu">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div class="auth-options">
            <label class="remember-me">
              <input type="checkbox" id="remember" checked />
              <span>Ghi nhớ phiên đăng nhập</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-login-submit">
            <span>Đăng nhập</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <div class="auth-footer-security">
            <i class="fa-solid fa-shield-halved"></i> System Secured • FutureSushi Management Suite
          </div>
        </form>
      </section>
    </div>
  `;
}



function renderSidebarGroup(title, views) {
  return `
    <section class="admin-sidebar-section">
      <div class="admin-sidebar-section-title">${escapeHtml(title)}</div>
      ${views.map(view => navItem(view)).join('')}
    </section>
  `;
}

function navItem(view) {
  const active = state.activeView === view ? 'active' : '';
  const labelMap = {
    overview: 'Trang tổng quan',
    users: 'Người dùng',
    categories: 'Danh mục món',
    products: 'Quản lý món ăn',
    tables: 'Quản lý bàn',
    reservations: 'Đặt bàn trước',
    orders: 'Quản lý đơn hàng',
    kitchen: 'Bếp KDS & Chế biến',
    payments: 'Lịch sử thanh toán',
    shifts: 'Ca thu ngân & Hủy PIN',
    vouchers: 'Mã giảm giá (Voucher)',
    inventory: 'Kho Barcode & Recipe',
    reviews: 'Đánh giá & Phản hồi',
    stats: 'Báo cáo & Lợi nhuận P&L'
  };

  let countBadge = '';
  if (view === 'orders') {
    const pending = (state.data.orders || []).filter(o => String(o.status).toUpperCase() === 'PENDING').length;
    if (pending > 0) countBadge = `<span class="nav-badge badge-rose">${pending} mới</span>`;
  } else if (view === 'kitchen') {
    const cooking = (state.data.orders || []).filter(o => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(String(o.status).toUpperCase())).length;
    if (cooking > 0) countBadge = `<span class="nav-badge badge-rose">${cooking} đơn</span>`;
  } else if (view === 'reservations') {
    const pending = (state.data.reservations || []).filter(r => String(r.status).toUpperCase() === 'PENDING').length;
    if (pending > 0) countBadge = `<span class="nav-badge badge-amber">${pending} chờ</span>`;
  } else if (view === 'tables') {
    const occupied = (state.data.tables || []).filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'OCCUPIED').length;
    if (occupied > 0) countBadge = `<span class="nav-badge badge-blue">${occupied} có khách</span>`;
  }

  return `
    <button class="nav-item ${active}" data-action="switch-view" data-view="${view}">
      <span class="nav-item-main">
        <span class="nav-icon-box"><i class="fa-solid ${NAV_ICONS[view]}"></i></span>
        <span class="nav-label">${labelMap[view]}</span>
      </span>
      ${countBadge}
    </button>
  `;
}

function renderActiveView() {
  if (state.loading) {
    return `
      <section class="panel loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu quản trị...</p>
      </section>
    `;
  }

  if (state.activeView === 'overview') {
    return renderOverview();
  }

  if (state.activeView === 'stats') {
    return renderStats();
  }

  if (state.activeView === 'inventory') {
    return renderInventoryView();
  }

  if (state.activeView === 'vouchers') {
    return renderVouchersView();
  }

  if (state.activeView === 'shifts') {
    return renderShiftsView();
  }

  if (state.activeView === 'kitchen') {
    return renderKitchenView();
  }

  return renderEntityView(state.activeView);
}

function renderOverview() {
  const stats = state.data.stats || {};
  const orders = state.data.orders || [];
  const tables = state.data.tables || [];
  const products = state.data.products || [];
  const payments = state.data.payments || [];
  const users = state.data.users || [];

  const recentOrders = orders.slice(0, 5);
  const totalOrdersCount = orders.filter(o => String(o.status).toUpperCase() !== 'CANCELLED').length;
  const cancelledOrdersCount = orders.filter(o => String(o.status).toUpperCase() === 'CANCELLED').length;
  const cancellationRate = totalOrdersCount > 0 ? ((cancelledOrdersCount / totalOrdersCount) * 100).toFixed(1) : '0.0';

  // --- Dynamic Alerts Calculation ---
  // 1. Stock / Product Alerts: products with low stock (<= 5) or disabled (!isAvailable)
  const lowStockProducts = products.filter(p => (p.stock !== undefined && p.stock !== null && p.stock <= 5) || p.isAvailable === false || String(p.status).toUpperCase() === 'OUT_OF_STOCK');
  
  // 2. Table Alerts: tables in CLEANING state or OCCUPIED
  const cleaningTables = tables.filter(t => (t.calculatedStatus || t.status) === 'CLEANING');
  const occupiedTables = tables.filter(t => (t.calculatedStatus || t.status) === 'OCCUPIED');

  // 3. Unpaid / Ready Orders Alerts: READY orders that are not PAID
  const readyUnpaidOrders = orders.filter(o => String(o.status).toUpperCase() === 'READY' && String(o.paymentStatus).toUpperCase() !== 'PAID');

  // Calculate PayOS Total Revenue
  const payosTotalAmount = payments
    .filter(p => String(p.status).toUpperCase() === 'SUCCESS' && (String(p.paymentMethod).toUpperCase() === 'PAYOS' || p.transactionCode?.includes('PAYOS')))
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return `
    <!-- Hero Banner Greeting -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 1.35rem 1.6rem; border-radius: 20px; color: #ffffff; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px rgba(15,23,42,0.12); flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem">
          <span style="background:rgba(59,130,246,0.2); color:#60a5fa; padding:0.2rem 0.6rem; border-radius:8px; font-size:0.75rem; font-weight:800; text-transform:uppercase; letter-spacing:0.5px">Dashboard Realtime</span>
          <span style="font-size:0.8rem; color:#94a3b8;"><i class="fa-regular fa-calendar-check" style="color:#38bdf8"></i> Hôm nay: ${new Date().toLocaleDateString('vi-VN')}</span>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 900; margin: 0; color: #ffffff;">Tổng quan Hoạt động Nhà Hàng</h2>
        <p style="font-size: 0.85rem; color: #94a3b8; margin: 0.2rem 0 0 0;">Theo dõi tình trạng tồn kho, sơ đồ bàn, đơn hàng POS & giao dịch PayOS realtime.</p>
      </div>
      <div style="display:flex; gap:0.6rem; flex-wrap:wrap">
        <button class="btn btn-primary" data-action="switch-view" data-view="orders" style="background:linear-gradient(135deg, #2563eb, #1d4ed8); font-weight:800; font-size:0.85rem"><i class="fa-solid fa-plus"></i> Quản lý Đơn POS</button>
        <button class="btn btn-primary" data-action="switch-view" data-view="inventory" style="background:linear-gradient(135deg, #7c3aed, #6d28d9); font-weight:800; font-size:0.85rem"><i class="fa-solid fa-boxes-stacked"></i> Quản lý Kho & Tồn kho (${products.length} món)</button>
        <button class="btn btn-secondary" data-action="switch-view" data-view="tables" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); font-weight:700; font-size:0.85rem"><i class="fa-solid fa-chair"></i> Sơ đồ Bàn (${occupiedTables.length}/${tables.length})</button>
      </div>
    </div>

    <!-- Dynamic Alert Cards Section -->
    <section class="smart-alerts-strip" style="display:grid; gap:0.85rem; margin-bottom:1.25rem">
      
      <!-- Alert 1: Stock Inventory Alert -->
      ${lowStockProducts.length > 0 ? `
        <div style="background: linear-gradient(90deg, #fff7ed 0%, #ffedd5 100%); border: 1px solid #fed7aa; border-radius: 16px; padding: 0.9rem 1.2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 4px 12px rgba(249,115,22,0.06); flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.85rem; flex: 1; min-width: 280px;">
            <span style="background: #f97316; color: white; width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(249,115,22,0.3);"><i class="fa-solid fa-triangle-exclamation"></i></span>
            <div>
              <strong style="color: #9a3412; font-size: 0.92rem; display: block;">
                Cảnh báo tồn kho: Có ${lowStockProducts.length} món sắp hết / tạm ngưng
              </strong>
              <div style="font-size: 0.82rem; color: #c2410c; margin-top: 0.15rem;">
                Món cảnh báo: ${lowStockProducts.slice(0, 3).map(p => `<strong>${escapeHtml(p.name)}</strong> (Tồn: ${p.stock ?? 0})`).join(', ')}${lowStockProducts.length > 3 ? ` và ${lowStockProducts.length - 3} món khác...` : ''}
              </div>
            </div>
          </div>
          <button class="btn btn-warning btn-small" data-action="switch-view" data-view="products" style="font-weight: 800; font-size: 0.82rem; padding: 0.45rem 0.85rem;">
            <i class="fa-solid fa-boxes-stacked"></i> Nạp thêm kho (${lowStockProducts.length} món)
          </button>
        </div>
      ` : `
        <div style="background: linear-gradient(90deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 16px; padding: 0.75rem 1.2rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="background: #16a34a; color: white; width: 32px; height: 32px; border-radius: 10px; display: grid; place-items: center; font-size: 0.95rem;"><i class="fa-solid fa-circle-check"></i></span>
            <div>
              <strong style="color: #166534; font-size: 0.88rem;">Kho hàng ổn định: Tất cả thực đơn đều đủ nguyên liệu phục vụ</strong>
            </div>
          </div>
          <button class="btn btn-ghost btn-small" data-action="switch-view" data-view="products" style="font-size:0.78rem; font-weight:700">Xem thực đơn (${products.length} món)</button>
        </div>
      `}

      <!-- Alert 2: Table Cleaning Alert -->
      ${cleaningTables.length > 0 ? `
        <div style="background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 16px; padding: 0.9rem 1.2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 4px 12px rgba(37,99,235,0.06); flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.85rem; flex: 1; min-width: 280px;">
            <span style="background: #2563eb; color: white; width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 4px 10px rgba(37,99,235,0.3);"><i class="fa-solid fa-broom"></i></span>
            <div>
              <strong style="color: #1e40af; font-size: 0.92rem; display: block;">
                Cảnh báo bàn ăn: Có ${cleaningTables.length} bàn đang cần dọn dẹp (Bàn ${cleaningTables.map(t => `#${t.tableNumber}`).join(', ')})
              </strong>
              <div style="font-size: 0.82rem; color: #1d4ed8; margin-top: 0.15rem;">
                Vui lòng nhắc nhở nhân viên dọn dẹp sạch sẽ để chuyển bàn sang sẵn sàng đón khách.
              </div>
            </div>
          </div>
          <div style="display:flex; gap:0.4rem">
            <button class="btn btn-primary btn-small" data-action="save-table-status" data-id="${cleaningTables[0].id}" data-status="AVAILABLE" style="font-weight: 800; font-size: 0.82rem; padding: 0.45rem 0.85rem;">
              <i class="fa-solid fa-check"></i> Đã dọn xong Bàn #${cleaningTables[0].tableNumber}
            </button>
            <button class="btn btn-secondary btn-small" data-action="switch-view" data-view="tables" style="font-weight: 700; font-size: 0.82rem; padding: 0.45rem 0.75rem;">
              <i class="fa-solid fa-chair"></i> Sơ đồ bàn
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Alert 3: Ready Orders Waiting for Payment Alert -->
      ${readyUnpaidOrders.length > 0 ? `
        <div style="background: linear-gradient(90deg, #fefce8 0%, #fef9c3 100%); border: 1px solid #fef08a; border-radius: 16px; padding: 0.9rem 1.2rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; box-shadow: 0 4px 12px rgba(202,138,4,0.06); flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 0.85rem; flex: 1; min-width: 280px;">
            <span style="background: #ca8a04; color: white; width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; font-size: 1.1rem; flex-shrink: 0;"><i class="fa-solid fa-cash-register"></i></span>
            <div>
              <strong style="color: #854d0e; font-size: 0.92rem; display: block;">
                Cảnh báo thu tiền: Đơn hàng #${readyUnpaidOrders[0].id} đã chế biến xong nhưng chưa thu tiền!
              </strong>
              <div style="font-size: 0.82rem; color: #a16207; margin-top: 0.15rem;">
                Tổng tiền: <strong>${formatCurrency(readyUnpaidOrders[0].finalPrice ?? readyUnpaidOrders[0].totalPrice)}</strong> - Vui lòng kiểm tra thanh toán với khách.
              </div>
            </div>
          </div>
          <button class="btn btn-primary btn-small" data-action="open-admin-checkout" data-id="${readyUnpaidOrders[0].id}" data-table="${readyUnpaidOrders[0].table_id || ''}" data-customer="${escapeHtml(readyUnpaidOrders[0].User?.fullName || 'Khách')}" data-amount="${readyUnpaidOrders[0].finalPrice ?? readyUnpaidOrders[0].totalPrice}" data-items="${(readyUnpaidOrders[0].OrderItems || []).length}" data-status="${readyUnpaidOrders[0].status}" style="font-weight: 800; font-size: 0.82rem; padding: 0.45rem 0.85rem; background: linear-gradient(135deg, #15803d, #16a34a);">
            <i class="fa-solid fa-wallet"></i> Thu tiền đơn #${readyUnpaidOrders[0].id}
          </button>
        </div>
      ` : ''}

    </section>

    <!-- KPI Summary Cards -->
    <section class="dashboard-kpis">
      <article class="dashboard-kpi-card">
        <div class="dashboard-kpi-header">
          <span class="dashboard-kpi-icon"><i class="fa-solid fa-money-bill-wave"></i></span>
          <span class="dashboard-kpi-trend up" title="Tốc độ tăng trưởng">+15.4%</span>
        </div>
        <div class="dashboard-kpi-label">Doanh thu tổng hệ thống</div>
        <div class="dashboard-kpi-value">${formatCurrency(stats?.totalRevenue || 0)}</div>
        <div style="font-size:0.75rem; color:#5f748d; margin-top:0.4rem">PayOS VietQR: <strong style="color:#0284c7">${formatCurrency(payosTotalAmount)}</strong></div>
      </article>

      <article class="dashboard-kpi-card">
        <div class="dashboard-kpi-header">
          <span class="dashboard-kpi-icon"><i class="fa-solid fa-cart-shopping"></i></span>
          <span class="dashboard-kpi-trend up">+8.2%</span>
        </div>
        <div class="dashboard-kpi-label">Đơn hàng hoàn thành</div>
        <div class="dashboard-kpi-value">${formatNumber(totalOrdersCount)} đơn</div>
        <div style="font-size:0.75rem; color:#5f748d; margin-top:0.4rem">Tỷ lệ hủy đơn: <strong style="color:#b91c1c">${cancellationRate}%</strong></div>
      </article>

      <article class="dashboard-kpi-card">
        <div class="dashboard-kpi-header">
          <span class="dashboard-kpi-icon"><i class="fa-solid fa-chair"></i></span>
          <span class="dashboard-kpi-trend neutral">Live ${tables.length > 0 ? Math.round((occupiedTables.length / tables.length) * 100) : 0}%</span>
        </div>
        <div class="dashboard-kpi-label">Công suất lấp đầy bàn</div>
        <div class="dashboard-kpi-value">${formatNumber(occupiedTables.length)} / ${formatNumber(tables.length)} bàn</div>
        <div style="margin-top:0.4rem; background:#e2e8f0; height:6px; border-radius:10px; overflow:hidden">
          <div style="background:linear-gradient(90deg, #2563eb, #0284c7); height:100%; width:${tables.length > 0 ? (occupiedTables.length / tables.length) * 100 : 0}%"></div>
        </div>
      </article>

      <article class="dashboard-kpi-card">
        <div class="dashboard-kpi-header">
          <span class="dashboard-kpi-icon"><i class="fa-solid fa-people-group"></i></span>
          <span class="dashboard-kpi-trend up">+12%</span>
        </div>
        <div class="dashboard-kpi-label">Khách hàng nhà hàng</div>
        <div class="dashboard-kpi-value">${formatNumber(users.length)} khách</div>
        <div style="font-size:0.75rem; color:#5f748d; margin-top:0.4rem">Tỷ lệ khách quay lại: <strong>68%</strong></div>
      </article>
    </section>

    <!-- Peak Hours & Revenue Distribution Grid -->
    <section class="dashboard-grid-two">
      <article class="dashboard-panel chart-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title">Phân tích doanh thu & Khung giờ cao điểm</h3>
            <p class="dashboard-panel-copy">Biểu đồ giờ cao điểm (Peak Hours 11h-13h & 18h-21h)</p>
          </div>
          <select class="dashboard-filter-select">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Năm nay</option>
          </select>
        </div>
        <div class="dashboard-chart-wrap">
          <div class="dashboard-chart-grid"></div>
          <div class="dashboard-chart-line"></div>
          <div class="dashboard-chart-dot"></div>
        </div>
        <div class="dashboard-chart-days">
          <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
        </div>
      </article>

      <article class="dashboard-panel donut-panel">
        <div class="dashboard-panel-header compact">
          <div>
            <h3 class="dashboard-panel-title">Tình trạng thực đơn</h3>
            <p class="dashboard-panel-copy">Phân bố sản phẩm & Tồn kho</p>
          </div>
        </div>
        <div class="dashboard-donut-wrap">
          <div class="dashboard-donut-ring">
            <div class="dashboard-donut-center">
              <div class="dashboard-donut-number">${formatNumber(products.length)}</div>
              <div class="dashboard-donut-note">Món thực đơn</div>
            </div>
          </div>
        </div>
        <div class="dashboard-donut-legend">
          <div class="dashboard-donut-item"><span class="dot primary"></span><span>Đang phục vụ</span><strong>${formatNumber(products.filter(p => p.isAvailable !== false && (p.stock === undefined || p.stock > 5)).length)}</strong></div>
          <div class="dashboard-donut-item"><span class="dot amber"></span><span>Sắp hết (≤ 5)</span><strong>${formatNumber(lowStockProducts.length)}</strong></div>
        </div>
      </article>
    </section>

    <!-- Recent Orders & Store QR Code Grid -->
    <section class="dashboard-grid-bottom">
      <article class="dashboard-panel table-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title">Đơn hàng gần đây</h3>
            <p class="dashboard-panel-copy">Cập nhật realtime từ POS & Mobile QR</p>
          </div>
          <button class="dashboard-link-btn" data-action="switch-view" data-view="orders">Xem tất cả</button>
        </div>
        <div class="dashboard-table-wrap">
          <table class="dashboard-orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Vị trí / Bàn</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th class="right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              ${recentOrders.map(order => {
                const tInfo = getOrderTableInfo(order, tables);
                return `
                <tr>
                  <td><strong style="font-family:monospace">#${escapeHtml(order.id)}</strong></td>
                  <td>${escapeHtml(order.User?.fullName || (order.user_id ? `Khách #${order.user_id}` : 'Khách vãng lai'))}</td>
                  <td><span class="badge-inline" style="background:#e0f2fe; color:#004ac6; font-weight:800"><i class="fa-solid ${tInfo.isTakeaway ? 'fa-bag-shopping' : 'fa-chair'}"></i> ${tInfo.label}</span></td>
                  <td>${escapeHtml(formatDateTime(order.createdAt || order.created_at))}</td>
                  <td>${statusChip(orderStatusClass(order.status), order.status)}</td>
                  <td class="right"><strong style="color:#15803d">${formatCurrency(order.finalPrice ?? order.totalPrice)}</strong></td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </article>

      <article class="dashboard-panel qr-panel">
        <div class="dashboard-panel-header compact">
          <div>
            <h3 class="dashboard-panel-title">Mã QR Gọi Món Tại Bàn</h3>
          </div>
        </div>
        <div class="dashboard-qr-box">
          <div class="dashboard-qr-code"><i class="fa-solid fa-qrcode"></i></div>
        </div>
        <div class="dashboard-qr-copy">AppDatMon QR Ordering</div>
        <div class="dashboard-qr-helper">Quét để gọi món và thanh toán ngay tại bàn</div>
        <div class="dashboard-qr-actions">
          <button class="btn btn-primary" onclick="alert('Đang tải mã QR tổng quan...')">Tải xuống</button>
          <button class="btn btn-secondary" onclick="alert('Đã sao chép đường dẫn QR!')">Chia sẻ</button>
        </div>
        <div class="dashboard-qr-status">
          <span>Trạng thái QR Menu</span>
          <span class="dashboard-qr-status-pill">🟢 Online Live</span>
        </div>
      </article>
    </section>

    <!-- BẢNG QUẢN LÝ KHO & XEM SỐ LƯỢNG TỒN KHO TRỰC TIẾP TRÊN DASHBOARD ADMIN -->
    <section class="dashboard-panel" style="margin-top:1.25rem">
      <div class="dashboard-panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem">
        <div>
          <h3 class="dashboard-panel-title"><i class="fa-solid fa-boxes-stacked" style="color:#7c3aed; margin-right:0.4rem"></i>Quản lý Kho & Xem Số Lượng Tồn Kho (Món Ăn & Nguyên Liệu)</h3>
          <p class="dashboard-panel-copy">Theo dõi trực tiếp số lượng suất tồn kho của từng món ăn trên thực đơn và nguyên vật liệu trong kho. Bấm "+20 suất" để nạp nhanh tồn kho.</p>
        </div>
        <div style="display:flex; gap:0.5rem">
          <button class="btn btn-primary btn-small" data-action="switch-view" data-view="inventory"><i class="fa-solid fa-barcode"></i> Mở Kho Barcode, FEFO & Recipe</button>
          <button class="btn btn-secondary btn-small" data-action="switch-view" data-view="products"><i class="fa-solid fa-bowl-food"></i> Quản lý Món ăn</button>
        </div>
      </div>

      <div class="dashboard-table-wrap" style="margin-top:0.6rem">
        <table class="dashboard-orders-table">
          <thead>
            <tr>
              <th>Mã món</th>
              <th>Tên món ăn</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Số lượng tồn kho</th>
              <th>Trạng thái</th>
              <th class="right">Nạp / Sửa nhanh tồn kho</th>
            </tr>
          </thead>
          <tbody>
            ${products.slice(0, 12).map(p => {
              const stockNum = Number(p.stock ?? 0);
              const isLow = stockNum <= 5;
              return `
                <tr>
                  <td><strong style="font-family:monospace">#${p.id}</strong></td>
                  <td><strong>${escapeHtml(p.name)}</strong> ${p.isSecretMenu ? '<span class="badge-inline" style="background:#fef3c7; color:#b45309; font-size:0.7rem">👑 VIP</span>' : ''}</td>
                  <td>${escapeHtml(categoryLabel(p.category_id))}</td>
                  <td><strong style="color:#004ac6">${formatCurrency(p.price)}</strong></td>
                  <td>
                    <span class="badge-inline" style="background:${stockNum <= 0 ? '#fee2e2' : isLow ? '#ffedd5' : '#dcfce7'}; color:${stockNum <= 0 ? '#dc2626' : isLow ? '#c2410c' : '#15803d'}; font-weight:800; font-size:0.86rem">
                      <i class="fa-solid fa-box"></i> ${formatNumber(stockNum)} suất
                    </span>
                  </td>
                  <td>${statusChip(p.isAvailable !== false && stockNum > 0 ? 'AVAILABLE' : 'BLOCKED', p.isAvailable !== false && stockNum > 0 ? 'Đang bán' : 'Hết / Tạm ngưng')}</td>
                  <td class="right">
                    <div style="display:inline-flex; gap:0.35rem; align-items:center">
                      <button class="btn btn-secondary btn-small" data-action="quick-add-stock" data-id="${p.id}" data-delta="20" title="Cộng nhanh thêm 20 suất vào tồn kho" style="color:#15803d; font-weight:800">+20 suất</button>
                      <button class="btn btn-ghost btn-small" data-action="edit-record" data-view="products" data-id="${p.id}" title="Chỉnh sửa số lượng tồn kho"><i class="fa-solid fa-pen"></i></button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderStats() {
  const stats = state.data.stats || {};
  const pnl = state.data.pnl || {};
  const products = state.data.products || [];
  const topProducts = products.slice(0, 5);
  const forecastList = Array.isArray(pnl.topDishesForecast) ? pnl.topDishesForecast : [];

  return `
    <section class="entity-page-header">
      <div>
        <h3 class="entity-page-title">Báo cáo Doanh thu, Lợi nhuận P&L & Dự báo</h3>
        <p class="entity-page-copy">Phân tích doanh thu, giá vốn nguyên liệu (COGS), chi phí hao hụt (Waste), lợi nhuận ròng P&L và dự báo món ăn bán chạy nhắc kho chuẩn bị.</p>
      </div>
      <div class="entity-page-actions">
        <button class="btn btn-secondary" data-action="stats-reset"><i class="fa-solid fa-rotate-right" style="margin-right:0.4rem"></i>Đặt lại bộ lọc</button>
      </div>
    </section>

    <section class="stats-shell" style="display:grid; gap:1.25rem">
      <!-- BÁO CÁO LỢI NHUẬN P&L (PROFIT & LOSS) -->
      <article class="dashboard-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-chart-pie" style="color:#2563eb; margin-right:0.4rem"></i>Báo cáo Lợi nhuận (Lời/Lỗ - P&L) Toàn Hệ Thống</h3>
            <p class="dashboard-panel-copy">Tính toán trực tiếp từ Doanh thu thực thu trừ Giá vốn nguyên liệu (COGS) và Chi phí hao hụt bếp (Waste).</p>
          </div>
          <span class="badge-inline" style="background:#dcfce7; color:#15803d; font-weight:800">Tỷ suất lợi nhuận: ${pnl.profitMargin ?? 0}%</span>
        </div>
        <div class="kpi-summary-strip" style="margin-top:0.5rem">
          <div class="kpi-mini-card">
            <div class="kpi-mini-icon blue"><i class="fa-solid fa-sack-dollar"></i></div>
            <div class="kpi-mini-copy">
              <span class="kpi-mini-label">Tổng Doanh Thu Thực Thu</span>
              <span class="kpi-mini-value" style="color:#2563eb">${formatCurrency(pnl.totalRevenue || 0)}</span>
            </div>
          </div>
          <div class="kpi-mini-card">
            <div class="kpi-mini-icon amber"><i class="fa-solid fa-boxes-packing"></i></div>
            <div class="kpi-mini-copy">
              <span class="kpi-mini-label">Giá Vốn Nguyên Liệu (COGS)</span>
              <span class="kpi-mini-value" style="color:#d97706">${formatCurrency(pnl.totalCOGS || 0)}</span>
            </div>
          </div>
          <div class="kpi-mini-card">
            <div class="kpi-mini-icon rose"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="kpi-mini-copy">
              <span class="kpi-mini-label">Chi Phí Hao Hụt Bếp (Waste)</span>
              <span class="kpi-mini-value" style="color:#dc2626">${formatCurrency(pnl.wasteCost || 0)}</span>
            </div>
          </div>
          <div class="kpi-mini-card">
            <div class="kpi-mini-icon green"><i class="fa-solid fa-money-bill-trend-up"></i></div>
            <div class="kpi-mini-copy">
              <span class="kpi-mini-label">Lợi Nhuận Gộp (Gross Profit)</span>
              <span class="kpi-mini-value" style="color:#16a34a">${formatCurrency(pnl.grossProfit || 0)}</span>
            </div>
          </div>
        </div>

        <div style="margin-top:1.25rem">
          <h4 style="margin:0 0 0.7rem; font-size:0.95rem; color:#0f172a"><i class="fa-solid fa-wand-magic-sparkles" style="color:#7c3aed"></i> Dự báo món ăn bán chạy ngày mai (+15%) & Nhắc nhở kho chuẩn bị nguyên liệu</h4>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Món ăn</th>
                  <th>Số lượng đã bán</th>
                  <th>Doanh thu món</th>
                  <th>Dự báo ngày mai (+15%)</th>
                  <th>Khuyến nghị chuẩn bị kho</th>
                </tr>
              </thead>
              <tbody>
                ${forecastList.length ? forecastList.map(d => `
                  <tr>
                    <td><strong>${escapeHtml(d.name)}</strong></td>
                    <td>${formatNumber(d.soldQty)} phần</td>
                    <td><strong style="color:#2563eb">${formatCurrency(d.revenue)}</strong></td>
                    <td><span class="badge-inline" style="background:#dcfce7; color:#15803d; font-weight:800">${formatNumber(d.forecastTomorrowQty)} phần</span></td>
                    <td>${escapeHtml(d.prepRecommendation)}</td>
                  </tr>
                `).join('') : `<tr><td colspan="5" style="text-align:center; color:#64748b; padding:1rem">Chưa có dữ liệu đơn hoàn thành để dự báo.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article class="dashboard-panel">
        <form class="stats-filters" data-form="stats-filter" style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap">
          <div class="field" style="min-width: 160px; margin:0">
            <label for="statsType">Kiểu thống kê</label>
            <select id="statsType" name="type">
              <option value="day" ${state.statsQuery.type === 'day' ? 'selected' : ''}>Theo ngày</option>
              <option value="month" ${state.statsQuery.type === 'month' ? 'selected' : ''}>Theo tháng</option>
              <option value="year" ${state.statsQuery.type === 'year' ? 'selected' : ''}>Theo năm</option>
            </select>
          </div>
          <div class="field" style="min-width: 220px; margin:0">
            <label for="statsDate">Ngày tham chiếu</label>
            <input id="statsDate" name="date" type="date" value="${escapeHtml(state.statsQuery.date)}" />
          </div>
          <div class="view-actions" style="align-self:end">
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-filter" style="margin-right:0.4rem"></i>Áp dụng bộ lọc</button>
          </div>
        </form>
      </article>

      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-chart-line"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Loại báo cáo</span>
            <span class="kpi-mini-value" style="text-transform:capitalize">${escapeHtml(stats.type || state.statsQuery.type)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-money-bill-trend-up"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng doanh thu kỳ lọc</span>
            <span class="kpi-mini-value">${formatCurrency(stats.totalRevenue || 0)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon amber"><i class="fa-solid fa-box-archive"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng đơn hoàn thành</span>
            <span class="kpi-mini-value">${formatNumber(stats.totalOrders || 0)} đơn</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon purple"><i class="fa-solid fa-calculator"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">TB / Đơn hàng</span>
            <span class="kpi-mini-value">${formatCurrency(stats.totalOrders ? (stats.totalRevenue / stats.totalOrders) : 0)}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid-two">
        <article class="dashboard-panel">
          <div class="dashboard-panel-header">
            <div>
              <h3 class="dashboard-panel-title">Chi tiết báo cáo doanh thu</h3>
              <p class="dashboard-panel-copy">Thời gian: ${escapeHtml(formatDateTime(stats.startDate || ''))} — ${escapeHtml(formatDateTime(stats.endDate || ''))}</p>
            </div>
          </div>
          <div class="info-list">
            <div class="info-row">
              <strong>Số đơn hàng hợp lệ</strong>
              <span class="badge-inline" style="background:#e7eeff; color:#004ac6">${formatNumber(stats.totalOrders || 0)} đơn</span>
            </div>
            <div class="info-row">
              <strong>Tổng doanh thu ghi nhận</strong>
              <strong style="color:#2faa66; font-size:1.1rem">${formatCurrency(stats.totalRevenue || 0)}</strong>
            </div>
            <div class="info-row">
              <strong>Mốc thời gian bắt đầu</strong>
              <span>${escapeHtml(formatDateTime(stats.startDate || ''))}</span>
            </div>
            <div class="info-row">
              <strong>Mốc thời gian kết thúc</strong>
              <span>${escapeHtml(formatDateTime(stats.endDate || ''))}</span>
            </div>
          </div>
        </article>

        <article class="dashboard-panel">
          <div class="dashboard-panel-header">
            <div>
              <h3 class="dashboard-panel-title">Món ăn nổi bật</h3>
              <p class="dashboard-panel-copy">Top thực đơn bán chạy trong hệ thống</p>
            </div>
          </div>
          <div class="top-products-list">
            ${topProducts.map((p, idx) => `
              <div class="top-product-item">
                <span class="top-product-rank">#${idx + 1}</span>
                <span class="top-product-name">${escapeHtml(p.name)}</span>
                <span class="top-product-val">${formatCurrency(p.price)}</span>
              </div>
            `).join('')}
          </div>
        </article>
      </div>
    </section>
  `;
}

function renderInventoryView() {
  const inventory = Array.isArray(state.data.inventory) ? state.data.inventory : [];
  const recipes = Array.isArray(state.data.recipes) ? state.data.recipes : [];
  const products = Array.isArray(state.data.products) ? state.data.products : [];
  const today = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const totalDishStock = products.reduce((sum, p) => sum + Number(p.stock ?? 0), 0);
  const lowDishCount = products.filter(p => Number(p.stock ?? 0) <= 5 || p.isAvailable === false).length;
  const totalBatchesCount = inventory.reduce((sum, ing) => sum + ((ing.batches || []).length), 0);

  return `
    <section class="entity-page-header">
      <div>
        <h3 class="entity-page-title">Quản lý Kho: Số Lượng Tồn Kho Món Ăn, Kho Barcode (FEFO) & Định Lượng Recipe</h3>
        <p class="entity-page-copy">Xem và cập nhật trực tiếp số lượng tồn kho từng món ăn, quét Barcode nhập lô nguyên vật liệu (MFG/EXP - FEFO) và thiết lập công thức tự động trừ kho.</p>
      </div>
    </section>

    <!-- 4 KPI TỒN KHO TỔNG QUAN -->
    <div class="kpi-summary-strip" style="margin-bottom:1.25rem">
      <div class="kpi-mini-card">
        <div class="kpi-mini-icon blue"><i class="fa-solid fa-bowl-food"></i></div>
        <div class="kpi-mini-copy">
          <span class="kpi-mini-label">Tổng món thực đơn</span>
          <span class="kpi-mini-value">${formatNumber(products.length)} món</span>
        </div>
      </div>
      <div class="kpi-mini-card">
        <div class="kpi-mini-icon green"><i class="fa-solid fa-boxes-stacked"></i></div>
        <div class="kpi-mini-copy">
          <span class="kpi-mini-label">Tổng số lượng tồn kho món</span>
          <span class="kpi-mini-value">${formatNumber(totalDishStock)} suất</span>
        </div>
      </div>
      <div class="kpi-mini-card">
        <div class="kpi-mini-icon rose"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="kpi-mini-copy">
          <span class="kpi-mini-label">Món sắp hết / Hết kho (≤ 5)</span>
          <span class="kpi-mini-value">${formatNumber(lowDishCount)} món</span>
        </div>
      </div>
      <div class="kpi-mini-card">
        <div class="kpi-mini-icon purple"><i class="fa-solid fa-barcode"></i></div>
        <div class="kpi-mini-copy">
          <span class="kpi-mini-label">Nguyên liệu Barcode & Lô FEFO</span>
          <span class="kpi-mini-value">${formatNumber(inventory.length)} NL (${formatNumber(totalBatchesCount)} lô)</span>
        </div>
      </div>
    </div>

    <!-- BẢNG 1: QUẢN LÝ & XEM SỐ LƯỢNG TỒN KHO TỪNG MÓN ĂN TRÊN THỰC ĐƠN -->
    <article class="dashboard-panel" style="margin-bottom:1.25rem">
      <div class="dashboard-panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem">
        <div>
          <h3 class="dashboard-panel-title"><i class="fa-solid fa-boxes-stacked" style="color:#2563eb; margin-right:0.4rem"></i>Bảng Số Lượng Tồn Kho Món Ăn Thực Đơn (${products.length} món)</h3>
          <p class="dashboard-panel-copy">Nhập số lượng tồn mới vào ô hoặc bấm "+20 suất" / "+50 suất" để nạp tồn kho tức thì cho từng món ăn.</p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên món ăn</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Giá vốn (COGS)</th>
              <th>Số lượng tồn kho hiện tại</th>
              <th>Trạng thái bán</th>
              <th style="text-align:right">Cập nhật số lượng tồn kho</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const stockNum = Number(p.stock ?? 0);
              const isLow = stockNum <= 5;
              return `
                <tr>
                  <td><strong>#${p.id}</strong></td>
                  <td>
                    <strong>${escapeHtml(p.name)}</strong>
                    ${p.isSecretMenu ? `<span class="badge-inline" style="background:#fef3c7; color:#b45309; font-size:0.72rem; margin-left:0.3rem">👑 Menu ẩn VIP</span>` : ''}
                  </td>
                  <td>${escapeHtml(categoryLabel(p.category_id))}</td>
                  <td><strong style="color:#004ac6">${formatCurrency(p.price)}</strong></td>
                  <td><span class="muted">${formatCurrency(p.costPrice || Math.round(Number(p.price || 0) * 0.38))}</span></td>
                  <td>
                    <span class="badge-inline" style="background:${stockNum <= 0 ? '#fee2e2' : isLow ? '#ffedd5' : '#dcfce7'}; color:${stockNum <= 0 ? '#dc2626' : isLow ? '#c2410c' : '#15803d'}; font-weight:800; font-size:0.9rem">
                      <i class="fa-solid fa-box"></i> ${formatNumber(stockNum)} suất
                    </span>
                  </td>
                  <td>${statusChip(p.isAvailable !== false && stockNum > 0 ? 'AVAILABLE' : 'BLOCKED', p.isAvailable !== false && stockNum > 0 ? 'Đang phục vụ' : 'Hết / Ngưng')}</td>
                  <td style="text-align:right">
                    <div style="display:inline-flex; gap:0.35rem; align-items:center; justify-content:flex-end">
                      <input type="number" min="0" value="${stockNum}" data-stock-input="${p.id}" style="width:82px; padding:0.35rem 0.5rem; border-radius:8px; border:1px solid #cbd5e1; font-weight:800; text-align:center" />
                      <button type="button" class="btn btn-primary btn-small" data-action="save-product-stock" data-id="${p.id}" title="Lưu số lượng tồn kho đã nhập">Lưu</button>
                      <button type="button" class="btn btn-secondary btn-small" data-action="quick-add-stock" data-id="${p.id}" data-delta="20" style="color:#15803d; font-weight:800" title="Cộng thêm 20 suất">+20</button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </article>

    <!-- THANH ĐIỀU HƯỚNG SLIDER & KHU VỰC TRƯỢT NGANG XEM KHO BARCODE & ĐỊNH LƯỢNG CÔNG THỨC MÓN ĂN -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:0.85rem; background:#ffffff; padding:0.75rem 1.1rem; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(15,23,42,0.04)">
      <div style="font-size:0.88rem; color:#0f172a; font-weight:700">
        <i class="fa-solid fa-arrows-left-right" style="color:#2563eb; margin-right:0.35rem"></i>
        Trượt ngang (Slide) hoặc bấm nút bên phải để chuyển nhanh giữa <strong>Kho Barcode (FEFO)</strong> và <strong>Định lượng Công thức Món ăn (Recipe)</strong>:
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
        <button type="button" class="btn btn-secondary btn-small" data-action="slide-inventory-panel" data-target="barcode" style="font-weight:800">
          <i class="fa-solid fa-barcode" style="color:#7c3aed"></i> ⬅️ Slide 1: Kho Barcode (FEFO)
        </button>
        <button type="button" class="btn btn-primary btn-small" data-action="slide-inventory-panel" data-target="recipe" style="font-weight:800; background:linear-gradient(135deg,#d97706,#ea580c)">
          <i class="fa-solid fa-flask"></i> Slide 2: Định lượng Công thức (Recipe) ➡️
        </button>
      </div>
    </div>

    <div id="inventoryHorizontalSlider" style="display:flex; gap:1.25rem; overflow-x:auto; scroll-behavior:smooth; scroll-snap-type:x mandatory; padding-bottom:0.85rem; align-items:stretch">
      <!-- Slide 1: Quét Barcode Nhập Kho & Lô hàng FEFO -->
      <article class="dashboard-panel" id="slide-panel-barcode" style="flex:0 0 min(100%, 640px); min-width:520px; scroll-snap-align:start">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-barcode" style="color:#7c3aed; margin-right:0.4rem"></i>Quét Barcode Nhập Kho Theo Lô (MFG / EXP)</h3>
            <p class="dashboard-panel-copy">Tự động khởi tạo nguyên liệu nếu mã Barcode chưa tồn tại và tạo lô hàng mới.</p>
          </div>
        </div>

        <form data-form="erp-barcode-import" style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem; background:#f8fafc; padding:1rem; border-radius:14px; border:1px solid #e2e8f0">
          <div class="field" style="margin:0">
            <label>Mã Barcode / QR</label>
            <input type="text" name="barcode" placeholder="VD: 8930001" required />
          </div>
          <div class="field" style="margin:0">
            <label>Tên nguyên liệu</label>
            <input type="text" name="name" placeholder="VD: Cá hồi Nauy tươi" required />
          </div>
          <div class="field" style="margin:0">
            <label>Số lượng nhập</label>
            <input type="number" name="quantity" min="1" step="0.01" placeholder="VD: 5000" required />
          </div>
          <div class="field" style="margin:0">
            <label>Đơn vị & Giá vốn / đơn vị (₫)</label>
            <div style="display:grid; grid-template-columns:90px 1fr; gap:0.4rem">
              <input type="text" name="unit" value="gram" placeholder="gram" required />
              <input type="number" name="unitCost" min="0" step="0.01" placeholder="Giá vốn (₫)" required />
            </div>
          </div>
          <div class="field" style="margin:0">
            <label>Ngày sản xuất (MFG)</label>
            <input type="date" name="mfgDate" value="${today}" required />
          </div>
          <div class="field" style="margin:0">
            <label>Hạn sử dụng (EXP - FEFO)</label>
            <input type="date" name="expDate" value="${nextWeek}" required />
          </div>
          <div style="grid-column:1/-1">
            <button type="submit" class="btn btn-primary" style="width:100%"><i class="fa-solid fa-plus"></i> Nhập Kho Lô Hàng Mới</button>
          </div>
        </form>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Nguyên liệu</th>
                <th>Tổng tồn</th>
                <th>Gợi ý xuất kho (FEFO - Hết hạn trước)</th>
              </tr>
            </thead>
            <tbody>
              ${inventory.length ? inventory.map(i => `
                <tr>
                  <td><code>${escapeHtml(i.barcode)}</code> (#${i.id})</td>
                  <td><strong>${escapeHtml(i.name)}</strong></td>
                  <td><strong style="color:#004ac6">${formatNumber(i.totalQuantity)} ${escapeHtml(i.unit)}</strong></td>
                  <td>
                    ${i.fefoSuggestion
                      ? `<span class="badge-inline" style="background:#fef2f2; color:#dc2626; font-weight:700">Lô ${escapeHtml(i.fefoSuggestion.batchCode)} • EXP: ${escapeHtml(i.fefoSuggestion.expDate)} (Còn ${formatNumber(i.fefoSuggestion.quantityRemaining)} ${escapeHtml(i.unit)})</span>`
                      : `<span class="muted">Hết lô tồn</span>`}
                  </td>
                </tr>
              `).join('') : `<tr><td colspan="4" style="text-align:center; padding:1.2rem; color:#64748b">Chưa có nguyên liệu trong kho. Hãy nhập lô đầu tiên bên trên!</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>

      <!-- Slide 2: Định lượng Công thức (Recipe) -->
      <article class="dashboard-panel" id="slide-panel-recipe" style="flex:0 0 min(100%, 640px); min-width:520px; scroll-snap-align:start">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-flask" style="color:#d97706; margin-right:0.4rem"></i>Định lượng Công thức Món ăn (Recipe)</h3>
            <p class="dashboard-panel-copy">Khi đơn hàng hoàn tất hoặc hủy hao hụt bếp (Waste), hệ thống tự động trừ kho theo định lượng này ưu tiên lô FEFO.</p>
          </div>
        </div>

        <form data-form="erp-recipe-save" style="display:grid; gap:0.75rem; margin-bottom:1.25rem; background:#f8fafc; padding:1rem; border-radius:14px; border:1px solid #e2e8f0">
          <div class="field" style="margin:0">
            <label>Chọn Món ăn</label>
            <select name="product_id" required>
              ${products.map(p => `<option value="${p.id}">#${p.id} • ${escapeHtml(p.name)}</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin:0">
            <label>Chọn Nguyên liệu trong kho</label>
            <select name="ingredient_id" required>
              ${inventory.length
                ? inventory.map(ing => `<option value="${ing.id}">#${ing.id} • ${escapeHtml(ing.name)} (${escapeHtml(ing.unit)})</option>`).join('')
                : `<option value="">-- Vui lòng nhập nguyên liệu ở cột bên trái trước --</option>`}
            </select>
          </div>
          <div class="field" style="margin:0">
            <label>Định lượng cần cho 1 phần ăn</label>
            <input type="number" name="amountRequired" min="0.1" step="0.1" placeholder="VD: 150 (gram/ml)" required />
          </div>
          <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Lưu Công Thức Định Lượng</button>
        </form>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Món ăn</th>
                <th>Nguyên liệu</th>
                <th>Định lượng / 1 suất</th>
              </tr>
            </thead>
            <tbody>
              ${recipes.length ? recipes.map(r => `
                <tr>
                  <td><strong>${escapeHtml(r.product?.name || `Món #${r.product_id}`)}</strong></td>
                  <td>${escapeHtml(r.ingredient?.name || `Nguyên liệu #${r.ingredient_id}`)}</td>
                  <td><span class="badge-inline" style="background:#e0f2fe; color:#0284c7; font-weight:800">${formatNumber(r.amountRequired)} ${escapeHtml(r.ingredient?.unit || 'gram')}</span></td>
                </tr>
              `).join('') : `<tr><td colspan="3" style="text-align:center; padding:1.2rem; color:#64748b">Chưa thiết lập định lượng công thức nào.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  `;
}

function renderVouchersView() {
  const vouchers = Array.isArray(state.data.vouchers) ? state.data.vouchers : [];

  return `
    <section class="entity-page-header">
      <div>
        <h3 class="entity-page-title">Quản lý Mã Giảm Giá (Voucher Khuyến Mãi)</h3>
        <p class="entity-page-copy">Tạo và quản lý mã Voucher áp dụng trực tiếp khi khách gọi món QR tại bàn, đặt Web Delivery hoặc tại quầy POS.</p>
      </div>
    </section>

    <div class="dashboard-grid-two" style="align-items:start">
      <article class="dashboard-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-ticket" style="color:#16a34a; margin-right:0.4rem"></i>Tạo Mã Voucher Mới</h3>
          </div>
        </div>
        <form data-form="erp-voucher-create" style="display:grid; gap:0.85rem">
          <div class="field" style="margin:0">
            <label>Mã Voucher (In hoa)</label>
            <input type="text" name="code" placeholder="VD: SUSHI50K, VIP10" required />
          </div>
          <div class="field" style="margin:0">
            <label>Loại giảm giá</label>
            <select name="discountType">
              <option value="FIXED">Giảm số tiền cố định (VNĐ)</option>
              <option value="PERCENT">Giảm theo phần trăm (%)</option>
            </select>
          </div>
          <div class="field" style="margin:0">
            <label>Giá trị giảm (VNĐ hoặc %)</label>
            <input type="number" name="discountValue" min="1" required placeholder="VD: 50000 hoặc 10" />
          </div>
          <div class="field" style="margin:0">
            <label>Giá trị đơn hàng tối thiểu (₫)</label>
            <input type="number" name="minOrderValue" min="0" value="100000" required />
          </div>
          <div class="field" style="margin:0">
            <label>Giới hạn số lượt sử dụng</label>
            <input type="number" name="usageLimit" min="1" value="100" required />
          </div>
          <button type="submit" class="btn btn-primary"><i class="fa-solid fa-plus"></i> Tạo Mã Giảm Giá</button>
        </form>
      </article>

      <article class="dashboard-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title">Danh sách Voucher đang hoạt động (${vouchers.length})</h3>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã Voucher</th>
                <th>Mức giảm</th>
                <th>Đơn tối thiểu</th>
                <th>Đã dùng</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${vouchers.length ? vouchers.map(v => `
                <tr>
                  <td><strong style="font-family:monospace; color:#004ac6; font-size:0.95rem">${escapeHtml(v.code)}</strong></td>
                  <td><strong style="color:#15803d">${v.discountType === 'PERCENT' ? `${v.discountValue}%` : formatCurrency(v.discountValue)}</strong></td>
                  <td>${formatCurrency(v.minOrderValue || 0)}</td>
                  <td>${formatNumber(v.usedCount || 0)} / ${formatNumber(v.usageLimit || 100)}</td>
                  <td>${statusChip(v.isActive !== false ? 'SUCCESS' : 'BLOCKED', v.isActive !== false ? 'Đang bật' : 'Ngưng')}</td>
                </tr>
              `).join('') : `<tr><td colspan="5" style="text-align:center; padding:1.2rem; color:#64748b">Chưa có mã giảm giá nào.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  `;
}

function renderShiftsView() {
  const s = state.data.currentShift;
  const orders = Array.isArray(state.data.orders) ? state.data.orders : [];
  const shiftLogsData = state.data.shiftLogs || {};
  const allShifts = Array.isArray(shiftLogsData.shifts) ? shiftLogsData.shifts : (s ? [s] : []);
  const cancelledOrders = Array.isArray(shiftLogsData.cancelledOrders)
    ? shiftLogsData.cancelledOrders
    : orders.filter(o => String(o.status).toUpperCase() === 'CANCELLED');

  return `
    <section class="entity-page-header">
      <div>
        <h3 class="entity-page-title">Quản lý Ca Thu Ngân, Nhật Ký Ca & Hủy Món Bằng Mã PIN</h3>
        <p class="entity-page-copy">Mở/Đóng ca đối soát tiền mặt thực đếm, duyệt hủy món/hao hụt bếp (Void/Waste) bằng mã PIN Quản lý, xem Nhật ký Log ca thu ngân và in hóa đơn GTGT (VAT 8%).</p>
      </div>
    </section>

    <div class="dashboard-grid-two" style="align-items:start; margin-bottom:1.25rem">
      <!-- 1. Quản lý Ca Thu Ngân -->
      <article class="dashboard-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-cash-register" style="color:#16a34a; margin-right:0.4rem"></i>Quản lý Ca Làm Việc Thu Ngân (Shift)</h3>
          </div>
        </div>

        <div style="margin-bottom:1rem; padding:1rem; border-radius:14px; background:${s && s.status === 'OPEN' ? '#f0fdf4' : '#f8fafc'}; border:1px solid ${s && s.status === 'OPEN' ? '#bbf7d0' : '#e2e8f0'}">
          ${s && s.status === 'OPEN' ? `
            <div style="font-weight:800; color:#15803d; font-size:0.95rem">🟢 CA ĐANG MỞ (#${s.id}) • Nhân viên: ${escapeHtml(s.staff?.fullName || state.user?.fullName || 'Thu ngân')}</div>
            <div style="font-size:0.85rem; color:#166534; margin-top:0.25rem">Tiền quỹ đầu ca: <strong>${formatCurrency(s.openingCash)}</strong> • Mở lúc: ${formatDateTime(s.openedAt)}</div>
            ${s.note ? `<div style="font-size:0.8rem; color:#15803d; margin-top:0.35rem; padding-top:0.35rem; border-top:1px dashed #bbf7d0">📝 <b>Log trong ca:</b> ${escapeHtml(s.note)}</div>` : ''}
          ` : s && s.id ? `
            <div style="font-weight:800; color:#334155; font-size:0.95rem">⚪ Ca gần nhất (#${s.id}) đã đóng</div>
            <div style="font-size:0.84rem; color:#475569; margin-top:0.25rem">
              Kỳ vọng: <strong>${formatCurrency(s.expectedCash)}</strong> • Thực đếm: <strong>${formatCurrency(s.closingCashActual)}</strong> • Chênh lệch: <strong style="color:${Number(s.discrepancy) < 0 ? '#dc2626' : '#15803d'}">${formatCurrency(s.discrepancy)}</strong>
            </div>
            ${s.note ? `<div style="font-size:0.8rem; color:#475569; margin-top:0.35rem">📝 <b>Log ca:</b> ${escapeHtml(s.note)}</div>` : ''}
          ` : `<div style="color:#64748b">⚪ Chưa có ca làm việc nào được mở trong phiên này.</div>`}
        </div>

        <form data-form="erp-shift-open" style="display:grid; grid-template-columns:1fr 1fr auto; gap:0.6rem; margin-bottom:1rem">
          <input type="number" name="openingCash" placeholder="Tiền quỹ đầu ca (VNĐ)" required />
          <input type="text" name="note" placeholder="Ghi chú mở ca" />
          <button type="submit" class="btn btn-primary" style="background:#16a34a">Mở Ca Mới</button>
        </form>

        <form data-form="erp-shift-close" style="display:grid; grid-template-columns:1fr 1fr auto; gap:0.6rem">
          <input type="number" name="closingCashActual" placeholder="Tiền mặt thực đếm cuối ca" required />
          <input type="text" name="note" placeholder="Ghi chú bàn giao ca" />
          <button type="submit" class="btn btn-danger">Đóng Ca & Đối Soát</button>
        </form>
      </article>

      <!-- 2. Hủy món / Hao hụt bằng mã PIN & In Hóa Đơn VAT -->
      <article class="dashboard-panel">
        <div class="dashboard-panel-header">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-ban" style="color:#dc2626; margin-right:0.4rem"></i>Hủy Đơn / Hao Hụt Bếp (Void / Waste - Cần PIN)</h3>
            <p class="dashboard-panel-copy">Mã PIN Quản lý mặc định: <code>123456</code>. Mọi thao tác hủy đều được tự động ghi Log vào Ca thu ngân đang mở.</p>
          </div>
        </div>

        <form data-form="erp-void-waste" style="display:grid; gap:0.75rem; margin-bottom:1.25rem">
          <div class="field" style="margin:0">
            <label>Chọn Đơn hàng cần hủy / báo hao hụt</label>
            <select name="orderId" required>
              ${orders.map(o => `<option value="${o.id}">Đơn #${o.id} • ${escapeHtml(o.User?.fullName || 'Khách vãng lai')} • ${formatCurrency(o.finalPrice ?? o.totalPrice)} (${o.status})</option>`).join('')}
            </select>
          </div>
          <div class="field" style="margin:0">
            <label>Hình thức xử lý</label>
            <select name="isWaste">
              <option value="false">Khách đổi ý / Trả món chưa nấu (Void - Hoàn lại tồn kho)</option>
              <option value="true">Bếp làm hỏng / Đổ bỏ (Waste - Trừ kho Recipe & Ghi nhận hao hụt P&L)</option>
            </select>
          </div>
          <div style="display:grid; grid-template-columns:1fr 180px; gap:0.6rem">
            <input type="text" name="reason" placeholder="Nhập lý do hủy / hao hụt..." required />
            <input type="password" name="managerPin" placeholder="Mã PIN (123456)" required />
          </div>
          <button type="submit" class="btn btn-danger"><i class="fa-solid fa-shield-halved"></i> Xác Nhận Duyệt Bằng Mã PIN Quản Lý</button>
        </form>

        <hr style="border:0; border-top:1px solid #e2e8f0; margin:1rem 0" />

        <div class="dashboard-panel-header compact">
          <div>
            <h3 class="dashboard-panel-title"><i class="fa-solid fa-print" style="color:#2563eb; margin-right:0.4rem"></i>In Hóa Đơn Giá Trị Gia Tăng (VAT 8%)</h3>
          </div>
        </div>
        <div style="display:flex; gap:0.6rem; align-items:center">
          <select id="erp-print-order-id" style="flex:1; padding:0.65rem; border-radius:10px; border:1px solid #cbd5e1; font-weight:700">
            ${orders.map(o => `<option value="${o.id}">Đơn #${o.id} • ${formatCurrency(o.finalPrice ?? o.totalPrice)} (${o.paymentStatus})</option>`).join('')}
          </select>
          <button type="button" class="btn btn-primary" data-action="print-vat-invoice"><i class="fa-solid fa-print"></i> In Hóa Đơn VAT</button>
        </div>
      </article>
    </div>

    <!-- 3. NHẬT KÝ LOG CA THU NGÂN (SHIFT HISTORY LOGS) -->
    <article class="dashboard-panel" style="margin-bottom:1.25rem">
      <div class="dashboard-panel-header">
        <div>
          <h3 class="dashboard-panel-title"><i class="fa-solid fa-clipboard-list" style="color:#004ac6; margin-right:0.4rem"></i>Nhật ký Lịch sử Ca Thu Ngân & Đối Soát Tiền Mặt (${allShifts.length} ca)</h3>
          <p class="dashboard-panel-copy">Lưu vết toàn bộ lịch sử mở ca, đóng ca, chênh lệch tiền mặt và nhật ký hoạt động/hủy đơn phát sinh trong từng ca.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mã Ca</th>
              <th>Nhân viên trực</th>
              <th>Giờ mở ca</th>
              <th>Giờ đóng ca</th>
              <th>Quỹ đầu ca</th>
              <th>Tiền kỳ vọng</th>
              <th>Thực đếm</th>
              <th>Chênh lệch</th>
              <th>Trạng thái</th>
              <th>Nhật ký / Ghi chú trong ca</th>
            </tr>
          </thead>
          <tbody>
            ${allShifts.length ? allShifts.map(sh => {
              const isOpen = String(sh.status).toUpperCase() === 'OPEN';
              const diff = Number(sh.discrepancy || 0);
              return `
                <tr>
                  <td><strong style="font-family:monospace">#CA-${sh.id}</strong></td>
                  <td><strong>${escapeHtml(sh.staff?.fullName || sh.staff?.username || (sh.staff_id ? `NV #${sh.staff_id}` : 'Admin / Thu ngân'))}</strong></td>
                  <td>${formatDateTime(sh.openedAt)}</td>
                  <td>${sh.closedAt ? formatDateTime(sh.closedAt) : '<span class="muted">Đang trực...</span>'}</td>
                  <td><strong>${formatCurrency(sh.openingCash || 0)}</strong></td>
                  <td>${isOpen ? '<span class="muted">Chờ đóng ca</span>' : `<strong>${formatCurrency(sh.expectedCash || 0)}</strong>`}</td>
                  <td>${isOpen ? '<span class="muted">-</span>' : `<strong>${formatCurrency(sh.closingCashActual || 0)}</strong>`}</td>
                  <td>
                    ${isOpen ? '<span class="muted">-</span>' : `<strong style="color:${diff < 0 ? '#dc2626' : '#15803d'}">${diff > 0 ? '+' : ''}${formatCurrency(diff)}</strong>`}
                  </td>
                  <td>${statusChip(isOpen ? 'SUCCESS' : 'COMPLETED', isOpen ? '🟢 ĐANG MỞ' : '⚪ ĐÃ ĐÓNG')}</td>
                  <td style="max-width:300px; font-size:0.82rem; color:#334155">${escapeHtml(sh.note || 'Không có ghi chú')}</td>
                </tr>
              `;
            }).join('') : `<tr><td colspan="10" style="text-align:center; padding:1.2rem; color:#64748b">Chưa có lịch sử ca thu ngân nào. Hãy mở ca mới ở phía trên!</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>

    <!-- 4. NHẬT KÝ HỦY ĐƠN / HAO HỤT BẾP (VOID & WASTE LOGS) -->
    <article class="dashboard-panel">
      <div class="dashboard-panel-header">
        <div>
          <h3 class="dashboard-panel-title"><i class="fa-solid fa-file-shield" style="color:#dc2626; margin-right:0.4rem"></i>Nhật ký Hủy Đơn & Hao Hụt Bếp (Void / Waste Audit Logs - ${cancelledOrders.length} đơn)</h3>
          <p class="dashboard-panel-copy">Danh sách các đơn hàng đã hủy kèm phân loại Void (hoàn kho) hoặc Waste (hao hụt bếp), lý do hủy và thời gian ghi nhận.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Bàn / Vị trí</th>
              <th>Món trong đơn</th>
              <th>Phân loại hủy</th>
              <th>Lý do hủy / Hao hụt</th>
              <th>Giá trị đơn</th>
              <th>Thời gian cập nhật</th>
            </tr>
          </thead>
          <tbody>
            ${cancelledOrders.length ? cancelledOrders.map(co => {
              const tInfo = getOrderTableInfo(co, state.data.tables);
              const itemsStr = (co.OrderItems || []).map(i => `${i.Product?.name || 'Món #' + i.product_id} (x${i.quantity})`).join(', ') || '-';
              return `
                <tr>
                  <td><strong style="font-family:monospace">#${co.id}</strong></td>
                  <td><strong>${escapeHtml(co.User?.fullName || 'Khách vãng lai')}</strong></td>
                  <td><span class="badge-inline" style="background:#e0f2fe; color:#004ac6; font-weight:700">${escapeHtml(tInfo.label)}</span></td>
                  <td style="font-size:0.82rem">${escapeHtml(itemsStr)}</td>
                  <td>
                    ${co.isWaste
                      ? `<span class="badge-inline" style="background:#fee2e2; color:#dc2626; font-weight:800"><i class="fa-solid fa-fire"></i> WASTE (Hao hụt bếp)</span>`
                      : `<span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800"><i class="fa-solid fa-rotate-left"></i> VOID (Hoàn kho)</span>`}
                  </td>
                  <td><strong>${escapeHtml(co.cancelReason || co.note || 'Hủy đơn tại quầy')}</strong></td>
                  <td><strong style="color:#dc2626">${formatCurrency(co.finalPrice ?? co.totalPrice)}</strong></td>
                  <td>${formatDateTime(co.updated_at || co.updatedAt || co.created_at)}</td>
                </tr>
              `;
            }).join('') : `<tr><td colspan="8" style="text-align:center; padding:1.2rem; color:#64748b">Chưa có đơn hàng nào bị hủy / hao hụt.</td></tr>`}
          </tbody>
        </table>
      </div>
    </article>
  `;
}

function renderKitchenView() {
  const orders = Array.isArray(state.data.orders) ? state.data.orders : [];
  const products = Array.isArray(state.data.products) ? state.data.products : [];
  const tables = Array.isArray(state.data.tables) ? state.data.tables : [];
  const q = String(state.filters.kitchen || '').trim().toLowerCase();

  const filteredOrders = orders.filter(order => {
    if (!q) return true;
    const tInfo = getOrderTableInfo(order, tables);
    const str = `${order.id} ${tInfo.label} ${order.note || ''} ${order.User?.fullName || ''} ${(order.OrderItems || []).map(i => i.Product?.name || '').join(' ')}`.toLowerCase();
    return str.includes(q);
  });

  const todoOrders = filteredOrders.filter(o => ['PENDING', 'CONFIRMED'].includes(String(o.status).toUpperCase()));
  const doingOrders = filteredOrders.filter(o => String(o.status).toUpperCase() === 'PREPARING');
  const doneOrders = filteredOrders.filter(o => String(o.status).toUpperCase() === 'READY');

  const renderKitchenCard = (order, colKey) => {
    const tInfo = getOrderTableInfo(order, tables);
    const customerName = order.User?.fullName || (order.user_id ? `Thành viên #${order.user_id}` : 'Khách vãng lai');
    const orderItems = order.OrderItems || [];

    const itemsHtml = orderItems.map(item => {
      const prodName = item.Product?.name || `Món #${item.product_id}`;
      return `
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem; padding:0.45rem 0; border-bottom:1.5px dashed rgba(115,118,134,0.14)">
          <div style="min-width:0; flex:1">
            <strong style="color:#0f172a; font-size:0.92rem">${escapeHtml(prodName)}</strong>
            ${item.note ? `<div style="font-size:0.75rem; color:#d97706">📝 ${escapeHtml(item.note)}</div>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap:0.35rem; flex-shrink:0">
            <span class="badge-inline" style="background:#dbe1ff; color:#004ac6; font-weight:800; font-size:0.84rem">x${item.quantity}</span>
            ${colKey !== 'done' ? `
              <button type="button" class="btn btn-danger btn-small" data-action="kitchen-cancel-item" data-order-id="${order.id}" data-item-id="${item.id}" data-product-name="${escapeHtml(prodName)}" style="padding:0.2rem 0.48rem; font-size:0.72rem; font-weight:800; background:#fee2e2; color:#dc2626; border:1px solid #fecaca" title="Hết món đột xuất -> Báo hủy món này khỏi đơn khách & tự động khóa món trên Menu">
                <i class="fa-solid fa-ban"></i> Hủy món
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1rem; box-shadow:0 4px 12px rgba(15,23,42,0.04); display:grid; gap:0.55rem">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <strong style="font-size:1.02rem; color:#004ac6"><i class="fa-solid fa-receipt"></i> Đơn #${order.id}</strong>
          ${tInfo.displayBadge}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:#64748b">
          <span>Khách: <strong>${escapeHtml(customerName)}</strong></span>
          <span><i class="fa-regular fa-clock"></i> ${formatDateTime(order.created_at || order.createdAt)}</span>
        </div>
        <div style="background:#f8fafc; padding:0.55rem 0.75rem; border-radius:12px; border:1px solid #e2e8f0">
          ${itemsHtml || '<div class="muted">Không có chi tiết món</div>'}
        </div>
        ${order.note ? `
          <div style="padding:0.45rem 0.65rem; background:#fff7d6; border-radius:10px; border:1px solid #fef08a; font-size:0.8rem; color:#b45309">
            <i class="fa-solid fa-note-sticky"></i> <strong>Ghi chú:</strong> ${escapeHtml(order.note)}
          </div>
        ` : ''}
        ${colKey === 'todo' ? `
          <div style="display:grid; grid-template-columns:1fr auto; gap:0.4rem; margin-top:0.25rem">
            <button type="button" class="btn btn-primary btn-small" data-action="kitchen-update-status" data-id="${order.id}" data-status="PREPARING" style="background:linear-gradient(135deg,#e11d48,#f43f5e); font-weight:800">
              <i class="fa-solid fa-fire"></i> Bắt đầu làm món
            </button>
            <button type="button" class="btn btn-danger btn-small" data-action="cancel-order" data-id="${order.id}" style="font-weight:800" title="Hủy toàn bộ đơn do hết món">
              <i class="fa-solid fa-ban"></i> Hủy đơn
            </button>
          </div>
        ` : colKey === 'doing' ? `
          <div style="display:grid; grid-template-columns:1fr auto; gap:0.4rem; margin-top:0.25rem">
            <button type="button" class="btn btn-primary btn-small" data-action="kitchen-update-status" data-id="${order.id}" data-status="READY" style="background:linear-gradient(135deg,#10b981,#059669); font-weight:800">
              <i class="fa-solid fa-circle-check"></i> Báo Hoàn thành (READY)
            </button>
            <button type="button" class="btn btn-danger btn-small" data-action="cancel-order" data-id="${order.id}" style="font-weight:800" title="Hủy toàn bộ đơn do hết món">
              <i class="fa-solid fa-ban"></i> Hủy đơn
            </button>
          </div>
        ` : `
          <div style="text-align:center; font-size:0.84rem; color:#15803d; font-weight:800; padding:0.45rem; background:#dcfce7; border-radius:10px">
            <i class="fa-solid fa-circle-check"></i> Đã nấu xong • Chờ phục vụ / Thu tiền
          </div>
        `}
      </div>
    `;
  };

  return `
    <section class="entity-page-header">
      <div>
        <h3 class="entity-page-title"><i class="fa-solid fa-fire-burner" style="color:#e11d48; margin-right:0.4rem"></i>Màn hình Điều phối Bếp (Kitchen KDS) & Báo Hủy Món Đột Xuất</h3>
        <p class="entity-page-copy">Tích hợp trực tiếp màn hình Bếp vào Dashboard Admin: chuyển trạng thái chế biến, báo hết món khẩn cấp hoặc bấm <strong>"🚫 Hủy món"</strong> ngay trên từng món trong đơn nếu hết nguyên liệu đột xuất.</p>
      </div>
      <div class="entity-page-actions">
        <a href="kitchen.html" target="_blank" class="btn btn-secondary"><i class="fa-solid fa-up-right-from-square"></i> Mở màn hình KDS Bếp riêng</a>
      </div>
    </section>

    <!-- BẢNG BÁO HẾT MÓN KHẨN CẤP -->
    <article class="dashboard-panel" style="margin-bottom:1.25rem">
      <div class="dashboard-panel-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem">
        <div>
          <h3 class="dashboard-panel-title"><i class="fa-solid fa-triangle-exclamation" style="color:#dc2626; margin-right:0.35rem"></i>Báo Hết Món Khẩn Cấp Trên Menu (${products.filter(p => p.isAvailable === false || Number(p.stock) <= 0).length} món đang ngưng)</h3>
          <p class="dashboard-panel-copy">Bấm "Báo hết" để khóa món ngay lập tức trên Menu QR của khách. Bấm "Mở bán (+20)" khi bếp đã có nguyên liệu trở lại.</p>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(230px, 1fr)); gap:0.65rem; max-height:220px; overflow-y:auto; padding-right:0.25rem">
        ${products.map(p => {
          const isOff = p.isAvailable === false || Number(p.stock ?? 0) <= 0;
          return `
            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; padding:0.55rem 0.75rem; border:1px solid ${isOff ? '#fecaca' : '#e2e8f0'}; background:${isOff ? '#fef2f2' : '#ffffff'}; border-radius:12px">
              <div style="min-width:0">
                <div style="font-weight:700; font-size:0.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">${escapeHtml(p.name)}</div>
                <div style="font-size:0.76rem; color:${isOff ? '#dc2626' : '#16a34a'}; font-weight:700">
                  ${isOff ? 'ĐÃ HẾT / TẠM NGƯNG' : 'Đang bán'} • Kho: ${formatNumber(p.stock ?? 0)}
                </div>
              </div>
              ${isOff ? `
                <button type="button" class="btn btn-primary btn-small" data-action="quick-add-stock" data-id="${p.id}" data-delta="20" style="font-weight:800; white-space:nowrap; padding:0.3rem 0.55rem; font-size:0.76rem">Mở bán (+20)</button>
              ` : `
                <button type="button" class="btn btn-secondary btn-small" data-action="toggle-product-available" data-id="${p.id}" style="font-weight:800; color:#dc2626; white-space:nowrap; padding:0.3rem 0.55rem; font-size:0.76rem">Báo hết</button>
              `}
            </div>
          `;
        }).join('')}
      </div>
    </article>

    <!-- 3 CỘT KANBAN CHẾ BIẾN BẾP -->
    <div style="display:grid; grid-template-columns:repeat(3, minmax(290px, 1fr)); gap:1.1rem; align-items:start; overflow-x:auto; padding-bottom:0.5rem">
      <!-- Cột 1: Chờ chế biến -->
      <article class="dashboard-panel" style="background:#f8fafc; border:1px solid #e2e8f0">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem; padding-bottom:0.6rem; border-bottom:2px solid #f59e0b">
          <h3 style="margin:0; font-size:1rem; font-weight:800; color:#b45309"><i class="fa-solid fa-clock"></i> 1. Chờ chế biến (PENDING/CONFIRMED)</h3>
          <span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800">${todoOrders.length} đơn</span>
        </div>
        <div style="display:grid; gap:0.8rem">
          ${todoOrders.length ? todoOrders.map(o => renderKitchenCard(o, 'todo')).join('') : `<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.86rem">Không có đơn chờ chế biến</div>`}
        </div>
      </article>

      <!-- Cột 2: Đang nấu -->
      <article class="dashboard-panel" style="background:#fff1f2; border:1px solid #fecdd3">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem; padding-bottom:0.6rem; border-bottom:2px solid #e11d48">
          <h3 style="margin:0; font-size:1rem; font-weight:800; color:#be123c"><i class="fa-solid fa-fire"></i> 2. Bếp đang làm (PREPARING)</h3>
          <span class="badge-inline" style="background:#ffe4e6; color:#be123c; font-weight:800">${doingOrders.length} đơn</span>
        </div>
        <div style="display:grid; gap:0.8rem">
          ${doingOrders.length ? doingOrders.map(o => renderKitchenCard(o, 'doing')).join('') : `<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.86rem">Chưa có món đang nấu</div>`}
        </div>
      </article>

      <!-- Cột 3: Đã xong (READY) -->
      <article class="dashboard-panel" style="background:#f0fdf4; border:1px solid #bbf7d0">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem; padding-bottom:0.6rem; border-bottom:2px solid #16a34a">
          <h3 style="margin:0; font-size:1rem; font-weight:800; color:#15803d"><i class="fa-solid fa-bell-concierge"></i> 3. Hoàn thành / Chờ bưng (READY)</h3>
          <span class="badge-inline" style="background:#dcfce7; color:#15803d; font-weight:800">${doneOrders.length} đơn</span>
        </div>
        <div style="display:grid; gap:0.8rem">
          ${doneOrders.length ? doneOrders.map(o => renderKitchenCard(o, 'done')).join('') : `<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.86rem">Chưa có đơn hoàn thành chờ phục vụ</div>`}
        </div>
      </article>
    </div>
  `;
}

function renderEntityView(view) {
  const config = ENTITY_CONFIGS[view];
  const rawRecords = state.data[view];
  const records = getFilteredRecords(view, rawRecords);
  const mode = state.viewModes[view] || 'grid';

  return `
    <section class="entity-page-header">
      <div>
        <h3 class="entity-page-title">${escapeHtml(VIEW_META[view].title)}</h3>
        <p class="entity-page-copy">${escapeHtml(VIEW_META[view].description)}</p>
      </div>
      <div class="entity-page-actions">
        ${config.allowCreate ? `<button class="btn btn-primary" data-action="create-record" data-view="${view}"><i class="fa-solid fa-plus" style="margin-right:0.4rem"></i>${escapeHtml(config.createLabel)}</button>` : ''}
      </div>
    </section>

    ${renderViewKpiSummary(view, rawRecords)}

    <section class="entity-toolbar-redesigned">
      ${renderViewFilterTabs(view, rawRecords)}
      
      <div style="display:flex; align-items:center; gap:0.8rem; margin-left:auto">
        <div class="admin-search-box" style="min-width:240px">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="search" placeholder="Tìm kiếm nhanh..." value="${escapeHtml(state.filters[view] || '')}" data-action="search-input" data-view="${view}" />
        </div>
        <div class="view-mode-toggle">
          <button class="view-mode-btn ${mode === 'grid' || mode === 'cards' || mode === 'floor' ? 'active' : ''}" data-action="toggle-view-mode" data-view="${view}" data-mode="grid" title="Dạng Thẻ / Sơ đồ">
            <i class="fa-solid fa-border-all"></i>
          </button>
          <button class="view-mode-btn ${mode === 'table' ? 'active' : ''}" data-action="toggle-view-mode" data-view="${view}" data-mode="table" title="Dạng Bảng">
            <i class="fa-solid fa-list"></i>
          </button>
        </div>
      </div>
    </section>

    <section class="entity-content-body">
      ${renderViewContent(view, records, mode)}
    </section>
  `;
}

function renderViewKpiSummary(view, rawData) {
  const list = Array.isArray(rawData) ? rawData : (rawData?.reviews || []);
  if (!list) return '';

  if (view === 'products') {
    const total = list.length;
    const available = list.filter(p => p.isAvailable).length;
    const outOfStock = list.filter(p => (p.stock ?? 0) <= 0).length;
    const avgPrice = total > 0 ? Math.round(list.reduce((acc, p) => acc + Number(p.price || 0), 0) / total) : 0;

    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-bowl-food"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng món ăn</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đang kinh doanh</span>
            <span class="kpi-mini-value">${formatNumber(available)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon rose"><i class="fa-solid fa-box-open"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Hết tồn kho</span>
            <span class="kpi-mini-value">${formatNumber(outOfStock)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon amber"><i class="fa-solid fa-tag"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Giá trung bình</span>
            <span class="kpi-mini-value">${formatCurrency(avgPrice)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (view === 'categories') {
    const total = list.length;
    const totalDishes = (state.data.products || []).length;
    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-folder-open"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng danh mục</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-utensils"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng số món liên kết</span>
            <span class="kpi-mini-value">${formatNumber(totalDishes)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (view === 'tables') {
    const total = list.length;
    const available = list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'AVAILABLE').length;
    const occupied = list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'OCCUPIED').length;
    const booked = list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'BOOKED').length;

    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-table"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng số bàn</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-circle-dot"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Bàn trống</span>
            <span class="kpi-mini-value">${formatNumber(available)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon amber"><i class="fa-solid fa-user-group"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đang có khách</span>
            <span class="kpi-mini-value">${formatNumber(occupied)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon purple"><i class="fa-solid fa-bookmark"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đã đặt trước</span>
            <span class="kpi-mini-value">${formatNumber(booked)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (view === 'reservations') {
    const total = list.length;
    const pending = list.filter(r => String(r.status).toUpperCase() === 'PENDING').length;
    const confirmed = list.filter(r => String(r.status).toUpperCase() === 'CONFIRMED').length;
    const arrived = list.filter(r => ['ARRIVED', 'CHECKED_IN', 'COMPLETED'].includes(String(r.status).toUpperCase())).length;

    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-calendar-check"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng lượt đặt</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon amber"><i class="fa-solid fa-clock"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Chờ xác nhận</span>
            <span class="kpi-mini-value">${formatNumber(pending)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đã xác nhận</span>
            <span class="kpi-mini-value">${formatNumber(confirmed)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon purple"><i class="fa-solid fa-person-walking-luggage"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đã nhận bàn</span>
            <span class="kpi-mini-value">${formatNumber(arrived)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (view === 'orders') {
    const total = list.length;
    const unpaid = list.filter(o => String(o.paymentStatus).toUpperCase() !== 'PAID').length;
    const preparing = list.filter(o => ['CONFIRMED', 'PREPARING'].includes(String(o.status).toUpperCase())).length;
    const completed = list.filter(o => String(o.status).toUpperCase() === 'COMPLETED').length;

    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-receipt"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng số đơn</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon rose"><i class="fa-solid fa-credit-card"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Chưa thanh toán</span>
            <span class="kpi-mini-value">${formatNumber(unpaid)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon amber"><i class="fa-solid fa-fire-burner"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đang làm món</span>
            <span class="kpi-mini-value">${formatNumber(preparing)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Đã hoàn thành</span>
            <span class="kpi-mini-value">${formatNumber(completed)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (view === 'users') {
    const total = list.length;
    const staff = list.filter(u => ['ADMIN', 'STAFF', 'KITCHEN', 'HOST'].includes(String(u.role).toUpperCase())).length;
    const customers = list.filter(u => String(u.role).toUpperCase() === 'CUSTOMER' || !u.role).length;
    const blocked = list.filter(u => String(u.status).toUpperCase() === 'BLOCKED' || String(u.status).toUpperCase() === 'INACTIVE').length;

    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-users"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng người dùng</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon purple"><i class="fa-solid fa-user-shield"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Nhân sự quản lý</span>
            <span class="kpi-mini-value">${formatNumber(staff)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-user-tag"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Khách hàng thành viên</span>
            <span class="kpi-mini-value">${formatNumber(customers)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon rose"><i class="fa-solid fa-user-slash"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Bị khóa tài khoản</span>
            <span class="kpi-mini-value">${formatNumber(blocked)}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (view === 'payments') {
    const total = list.length;
    const totalAmount = list.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const cashCount = list.filter(p => String(p.paymentMethod).toUpperCase() === 'CASH').length;
    const onlineCount = list.filter(p => ['PAYOS', 'TRANSFER', 'BANKING', 'VNPAY', 'MOMO'].includes(String(p.paymentMethod).toUpperCase())).length;

    return `
      <div class="kpi-summary-strip">
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon blue"><i class="fa-solid fa-credit-card"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng giao dịch</span>
            <span class="kpi-mini-value">${formatNumber(total)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon green"><i class="fa-solid fa-sack-dollar"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tổng tiền thu</span>
            <span class="kpi-mini-value">${formatCurrency(totalAmount)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon amber"><i class="fa-solid fa-money-bill-wave"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Tiền mặt</span>
            <span class="kpi-mini-value">${formatNumber(cashCount)}</span>
          </div>
        </div>
        <div class="kpi-mini-card">
          <div class="kpi-mini-icon purple"><i class="fa-solid fa-qrcode"></i></div>
          <div class="kpi-mini-copy">
            <span class="kpi-mini-label">Chuyển khoản / PayOS</span>
            <span class="kpi-mini-value">${formatNumber(onlineCount)}</span>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

function renderViewFilterTabs(view, rawData) {
  const activeTab = state.activeTabs[view] || 'ALL';
  const list = Array.isArray(rawData) ? rawData : (rawData?.reviews || []);
  if (!list) return '';

  let tabs = [];
  if (view === 'products') {
    tabs = [
      { id: 'ALL', label: 'Tất cả món', count: list.length },
      { id: 'AVAILABLE', label: 'Đang bán', count: list.filter(p => p.isAvailable).length },
      { id: 'UNAVAILABLE', label: 'Tạm ngưng', count: list.filter(p => !p.isAvailable).length },
      { id: 'OUT_OF_STOCK', label: 'Hết hàng', count: list.filter(p => (p.stock ?? 0) <= 0).length }
    ];
  } else if (view === 'tables') {
    tabs = [
      { id: 'ALL', label: 'Tất cả bàn', count: list.length },
      { id: 'AVAILABLE', label: 'Bàn trống', count: list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'AVAILABLE').length },
      { id: 'OCCUPIED', label: 'Đang ăn', count: list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'OCCUPIED').length },
      { id: 'BOOKED', label: 'Đã đặt trước', count: list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'BOOKED').length },
      { id: 'CLEANING', label: 'Cần dọn', count: list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === 'CLEANING').length }
    ];
  } else if (view === 'reservations') {
    tabs = [
      { id: 'ALL', label: 'Tất cả', count: list.length },
      { id: 'PENDING', label: 'Chờ xác nhận ⏳', count: list.filter(r => String(r.status).toUpperCase() === 'PENDING').length },
      { id: 'CONFIRMED', label: 'Đã xác nhận ✅', count: list.filter(r => String(r.status).toUpperCase() === 'CONFIRMED').length },
      { id: 'ARRIVED', label: 'Đã nhận bàn 🚶', count: list.filter(r => ['ARRIVED', 'CHECKED_IN', 'COMPLETED'].includes(String(r.status).toUpperCase())).length },
      { id: 'CANCELLED', label: 'Đã hủy ❌', count: list.filter(r => String(r.status).toUpperCase() === 'CANCELLED').length }
    ];
  } else if (view === 'orders') {
    tabs = [
      { id: 'ALL', label: 'Tất cả đơn', count: list.length },
      { id: 'PENDING', label: 'Chờ xử lý ⏳', count: list.filter(o => String(o.status).toUpperCase() === 'PENDING').length },
      { id: 'PREPARING', label: 'Đang làm món 🍳', count: list.filter(o => ['CONFIRMED', 'PREPARING'].includes(String(o.status).toUpperCase())).length },
      { id: 'READY', label: 'Sẵn sàng 🔔', count: list.filter(o => String(o.status).toUpperCase() === 'READY').length },
      { id: 'COMPLETED', label: 'Hoàn thành ✅', count: list.filter(o => String(o.status).toUpperCase() === 'COMPLETED').length },
      { id: 'UNPAID', label: 'Chưa trả tiền 💳', count: list.filter(o => String(o.paymentStatus).toUpperCase() !== 'PAID').length }
    ];
  } else if (view === 'payments') {
    tabs = [
      { id: 'ALL', label: 'Tất cả GD', count: list.length },
      { id: 'SUCCESS', label: 'Thành công ✅', count: list.filter(p => String(p.status).toUpperCase() === 'SUCCESS').length },
      { id: 'CASH', label: 'Tiền mặt 💵', count: list.filter(p => String(p.paymentMethod).toUpperCase() === 'CASH').length },
      { id: 'ONLINE', label: 'Chuyển khoản / PayOS 📲', count: list.filter(p => ['PAYOS', 'TRANSFER', 'BANKING', 'VNPAY', 'MOMO'].includes(String(p.paymentMethod).toUpperCase())).length }
    ];
  } else if (view === 'users') {
    tabs = [
      { id: 'ALL', label: 'Tất cả', count: list.length },
      { id: 'ADMIN', label: 'ADMIN', count: list.filter(u => String(u.role).toUpperCase() === 'ADMIN').length },
      { id: 'STAFF', label: 'STAFF', count: list.filter(u => String(u.role).toUpperCase() === 'STAFF').length },
      { id: 'HOST', label: 'HOST', count: list.filter(u => String(u.role).toUpperCase() === 'HOST').length },
      { id: 'KITCHEN', label: 'KITCHEN', count: list.filter(u => String(u.role).toUpperCase() === 'KITCHEN').length },
      { id: 'CUSTOMER', label: 'CUSTOMER', count: list.filter(u => String(u.role).toUpperCase() === 'CUSTOMER' || !u.role).length }
    ];
  } else if (view === 'reviews') {
    tabs = [
      { id: 'ALL', label: 'Tất cả', count: list.length },
      { id: '5', label: '5 Sao ★★★★★', count: list.filter(r => Number(r.rating) === 5).length },
      { id: '4', label: '4 Sao ★★★★', count: list.filter(r => Number(r.rating) === 4).length },
      { id: 'LOW', label: '1 - 3 Sao ★', count: list.filter(r => Number(r.rating) <= 3).length }
    ];
  }

  if (tabs.length === 0) return '<div></div>';

  return `
    <div class="filter-tabs-group">
      ${tabs.map(tab => `
        <button class="filter-tab ${activeTab === tab.id ? 'active' : ''}" data-action="set-filter-tab" data-view="${view}" data-tab="${tab.id}">
          <span>${tab.label}</span>
          <span class="filter-tab-count">${tab.count}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function getFilteredRecords(view, records) {
  let list = Array.isArray(records) ? records : (records?.reviews || []);
  const activeTab = state.activeTabs[view] || 'ALL';
  const query = (state.filters[view] || '').trim().toLowerCase();

  if (activeTab !== 'ALL') {
    if (view === 'products') {
      if (activeTab === 'AVAILABLE') list = list.filter(p => p.isAvailable);
      else if (activeTab === 'UNAVAILABLE') list = list.filter(p => !p.isAvailable);
      else if (activeTab === 'OUT_OF_STOCK') list = list.filter(p => (p.stock ?? 0) <= 0);
    } else if (view === 'tables') {
      list = list.filter(t => String(t.calculatedStatus || t.status).toUpperCase() === activeTab);
    } else if (view === 'reservations') {
      if (activeTab === 'ARRIVED') list = list.filter(r => ['ARRIVED', 'CHECKED_IN', 'COMPLETED'].includes(String(r.status).toUpperCase()));
      else list = list.filter(r => String(r.status).toUpperCase() === activeTab);
    } else if (view === 'orders') {
      if (activeTab === 'PREPARING') list = list.filter(o => ['CONFIRMED', 'PREPARING'].includes(String(o.status).toUpperCase()));
      else if (activeTab === 'UNPAID') list = list.filter(o => String(o.paymentStatus).toUpperCase() !== 'PAID');
      else list = list.filter(o => String(o.status).toUpperCase() === activeTab);
    } else if (view === 'payments') {
      if (activeTab === 'SUCCESS') list = list.filter(p => String(p.status).toUpperCase() === 'SUCCESS');
      else if (activeTab === 'CASH') list = list.filter(p => String(p.paymentMethod).toUpperCase() === 'CASH');
      else if (activeTab === 'ONLINE') list = list.filter(p => ['PAYOS', 'TRANSFER', 'BANKING', 'VNPAY', 'MOMO'].includes(String(p.paymentMethod).toUpperCase()));
    } else if (view === 'users') {
      if (activeTab === 'CUSTOMER') list = list.filter(u => String(u.role).toUpperCase() === 'CUSTOMER' || !u.role);
      else list = list.filter(u => String(u.role).toUpperCase() === activeTab);
    } else if (view === 'reviews') {
      if (activeTab === 'LOW') list = list.filter(r => Number(r.rating) <= 3);
      else list = list.filter(r => String(r.rating) === activeTab);
    }
  }

  if (!query) return list;
  return list.filter(record => {
    if (view === 'orders') {
      const tInfo = getOrderTableInfo(record, state.data.tables);
      const searchStr = `${JSON.stringify(record)} ${tInfo.label} ${tInfo.tableNumber || ''}`.toLowerCase();
      return searchStr.includes(query);
    }
    return JSON.stringify(record).toLowerCase().includes(query);
  });
}

function renderViewContent(view, records, mode) {
  if (records?.__error) {
    return `<div class="error-state"><strong>Lỗi tải dữ liệu</strong><p>${escapeHtml(records.__error)}</p></div>`;
  }

  if (mode === 'table') {
    return renderDataTable(view, records);
  }

  if (view === 'products') return renderProductsGrid(records);
  if (view === 'categories') return renderCategoriesGrid(records);
  if (view === 'tables') return renderTablesFloorGrid(records, state.activeTabs.tables || 'ALL', state.data.orders, state.data.reservations);
  if (view === 'reservations') return renderReservationsGrid(records);
  if (view === 'orders') return renderOrdersGrid(records, state.activeTabs.orders || 'ALL', state.data.tables);
  if (view === 'payments') return renderPaymentsGrid(records, state.activeTabs.payments || 'ALL', state.data.tables);
  if (view === 'users') return renderUsersGrid(records);
  if (view === 'reviews') return renderReviewsGrid(records);

  return renderDataTable(view, records);
}



function renderCategoriesGrid(records) {
  if (!records || records.length === 0) {
    return `<div class="empty-state"><strong>Chưa có danh mục món nào</strong><p>Bấm Thêm danh mục để tạo mới.</p></div>`;
  }

  return `
    <div class="categories-grid">
      ${records.map(cat => `
        <article class="category-card">
          <div class="category-card-media">
            ${cat.image ? `<img src="${escapeHtml(cat.image)}" alt="${escapeHtml(cat.name)}" />` : `<div class="product-card-placeholder" style="height:100%"><i class="fa-solid fa-folder-open"></i></div>`}
            <span class="category-card-badge">${formatNumber(cat.productCount ?? 0)} Món</span>
          </div>
          <div class="category-card-body">
            <h4 class="category-card-title">${escapeHtml(cat.name)}</h4>
            <p class="category-card-desc">${escapeHtml(cat.description || 'Không có mô tả.')}</p>
            <div class="row-actions" style="margin-top:auto">
              <button class="btn btn-secondary btn-small" data-action="edit-record" data-view="categories" data-id="${cat.id}"><i class="fa-solid fa-pen"></i> Sửa</button>
              <button class="btn btn-danger btn-small" data-action="delete-record" data-view="categories" data-id="${cat.id}"><i class="fa-solid fa-trash"></i> Xóa</button>
            </div>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}



function renderReviewsGrid(records) {
  const list = Array.isArray(records?.reviews) ? records.reviews : records;
  if (!list || list.length === 0) {
    return `<div class="empty-state"><strong>Chưa có phản hồi đánh giá nào</strong></div>`;
  }

  const total = list.length;
  const avgRating = total > 0 ? (list.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / total).toFixed(1) : '5.0';

  return `
    <div class="reviews-hero-widget">
      <div class="reviews-score-box">
        <div class="reviews-score-big">${avgRating}</div>
        <div>
          <div class="reviews-stars-display">${'★'.repeat(Math.round(Number(avgRating)))}</div>
          <div style="font-weight:600; opacity:0.9; margin-top:0.2rem">Dựa trên ${formatNumber(total)} phản hồi từ khách hàng</div>
        </div>
      </div>
      <div style="text-align:right">
        <span class="badge-inline" style="background:rgba(255,255,255,0.2); color:white">Hệ thống đánh giá món ăn</span>
      </div>
    </div>

    <div class="reviews-grid">
      ${list.map(rev => {
        const name = rev.user?.fullName || rev.phone || 'Khách ẩn danh';
        const initials = userInitials({ fullName: name });
        const ratingStars = '★'.repeat(Number(rev.rating) || 5);
        const isHidden = String(rev.status || 'VISIBLE').toUpperCase() === 'HIDDEN';

        return `
          <article class="review-card" style="display:flex; flex-direction:column; height:100%; ${isHidden ? 'opacity:0.68; border-style:dashed' : ''}">
            <div class="review-card-head">
              <div class="reviewer-info">
                <div class="reviewer-avatar">${initials}</div>
                <div>
                  <div style="font-weight:700">${escapeHtml(name)}</div>
                  <div class="review-stars">${ratingStars}</div>
                </div>
              </div>
              <div style="text-align:right">
                ${statusChip(isHidden ? 'BLOCKED' : 'SUCCESS', isHidden ? 'Đang ẩn' : 'Hiển thị')}
                <div class="muted" style="font-size:0.75rem; margin-top:0.2rem">${formatDateTime(rev.created_at || rev.createdAt)}</div>
              </div>
            </div>

            ${rev.dish_name ? `<span class="review-dish-tag"><i class="fa-solid fa-bowl-food"></i> ${escapeHtml(rev.dish_name)}</span>` : ''}

            <div class="review-content-box">
              "${escapeHtml(rev.content || 'Khách hàng không để lại lời nhắn.')}"
            </div>

            ${rev.reply ? `
              <div style="background:#eff6ff; border-left:3px solid #2563eb; padding:0.75rem 0.9rem; border-radius:10px; font-size:0.84rem; color:#1e293b; margin-bottom:0.75rem">
                <div style="font-weight:800; color:#1d4ed8; font-size:0.78rem; margin-bottom:0.2rem">
                  <i class="fa-solid fa-reply"></i> Phản hồi từ Nhà hàng FutureSushi:
                </div>
                <div>${escapeHtml(rev.reply)}</div>
              </div>
            ` : ''}

            <div class="row-actions" style="margin-top:auto; justify-content:flex-end; gap:0.4rem; flex-wrap:wrap">
              <button class="btn btn-primary btn-small" data-action="reply-review" data-id="${rev.id}" data-reply="${escapeHtml(rev.reply || '')}">
                <i class="fa-solid fa-reply"></i> ${rev.reply ? 'Sửa phản hồi' : 'Phản hồi'}
              </button>
              <button class="btn btn-secondary btn-small" data-action="toggle-review-status" data-id="${rev.id}" data-status="${isHidden ? 'VISIBLE' : 'HIDDEN'}">
                <i class="fa-solid ${isHidden ? 'fa-eye' : 'fa-eye-slash'}"></i> ${isHidden ? 'Hiện lại' : 'Ẩn'}
              </button>
              <button class="btn btn-danger btn-small" data-action="delete-record" data-view="reviews" data-id="${rev.id}">
                <i class="fa-solid fa-trash"></i> Xóa
              </button>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderDataTable(view, records) {
  if (records?.__error) {
    return `<div class="error-state"><strong>Lỗi tải dữ liệu</strong><p>${escapeHtml(records.__error)}</p></div>`;
  }

  if (!records || records.length === 0) {
    return `<div class="empty-state"><strong>Chưa có dữ liệu</strong><p>Không có bản ghi nào cho mục này.</p></div>`;
  }

  if (view === 'reviews') {
    return renderReviewsTable(records);
  }

  if (view === 'orders') {
    return renderOrdersTable(records);
  }

  if (view === 'users') {
    return renderUsersTable(records);
  }

  if (view === 'payments') {
    return renderPaymentsTable(records);
  }

  const columns = ENTITY_CONFIGS[view].columns;
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            ${columns.map(column => `<th>${escapeHtml(column.label)}</th>`).join('')}
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(record => renderEntityRow(view, record)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderUsersTable(records) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><i class="fa-solid fa-user" style="color:#3b82f6"></i> Thành viên</th>
            <th><i class="fa-solid fa-phone" style="color:#64748b"></i> Số điện thoại</th>
            <th><i class="fa-solid fa-user-shield" style="color:#8b5cf6"></i> Vai trò</th>
            <th><i class="fa-solid fa-shield-halved" style="color:#10b981"></i> Trạng thái</th>
            <th style="text-align:right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(user => {
            const initials = userInitials(user);
            const role = String(user.role || 'CUSTOMER').toUpperCase();
            const isBlocked = String(user.status || 'ACTIVE').toUpperCase() === 'BLOCKED';

            return `
              <tr>
                <td>
                  <div style="display:flex; align-items:center; gap:0.75rem">
                    <div class="user-card-avatar" style="width:40px; height:40px; font-size:0.92rem; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.06)">
                      ${user.avatar ? `<img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.fullName)}" />` : initials}
                    </div>
                    <div>
                      <strong style="display:block; font-size:0.95rem; color:#0f172a">${escapeHtml(user.fullName || 'Người dùng')}</strong>
                      <small style="color:#64748b">@${escapeHtml(user.username || 'user')}</small>
                    </div>
                  </div>
                </td>
                <td><i class="fa-solid fa-phone" style="font-size:0.78rem; color:#94a3b8; margin-right:0.3rem"></i> ${escapeHtml(user.phone || '-')}</td>
                <td>${statusChip(role, role)}</td>
                <td>${statusChip(isBlocked ? 'blocked' : 'active', isBlocked ? 'Bị khóa' : 'Hoạt động')}</td>
                <td style="text-align:right">
                  <div class="row-actions" style="justify-content:flex-end">
                    <button class="btn btn-ghost btn-small" data-action="view-user-detail" data-id="${user.id}"><i class="fa-solid fa-eye"></i> Chi tiết</button>
                    <button class="btn btn-secondary btn-small" data-action="edit-record" data-view="users" data-id="${user.id}" title="Sửa"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-danger btn-small" data-action="delete-record" data-view="users" data-id="${user.id}" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPaymentsTable(records) {
  const list = Array.isArray(records) ? records : [];
  if (list.length === 0) {
    return `<div class="empty-state"><strong>Chưa có dữ liệu thanh toán</strong></div>`;
  }

  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><i class="fa-solid fa-hashtag" style="color:#3b82f6"></i> Mã GD System</th>
            <th><i class="fa-solid fa-qrcode" style="color:#0284c7"></i> Mã PayOS</th>
            <th><i class="fa-solid fa-receipt" style="color:#2563eb"></i> Mã đơn</th>
            <th><i class="fa-solid fa-user" style="color:#64748b"></i> Khách hàng</th>
            <th><i class="fa-solid fa-money-bill-wave" style="color:#16a34a"></i> Số tiền</th>
            <th><i class="fa-solid fa-wallet" style="color:#8b5cf6"></i> Phương thức</th>
            <th><i class="fa-solid fa-shield-halved" style="color:#10b981"></i> Trạng thái</th>
            <th><i class="fa-regular fa-clock" style="color:#64748b"></i> Thời gian</th>
            <th style="text-align:right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(payment => {
            const order = payment.Order || {};
            const customerName = order.User?.fullName || (order.user_id ? `Khách #${order.user_id}` : 'Khách vãng lai');
            const rawMethod = String(payment.paymentMethod || 'CASH').toUpperCase();
            const rawStatus = String(payment.status || 'SUCCESS').toUpperCase();
            
            const matchNote = order.note?.match(/\[PAYOS:(\d+)\]/);
            const matchTxn = payment.transactionCode?.match(/PAYOS-(\d+)/);
            const payosCode = matchNote ? matchNote[1] : (matchTxn ? matchTxn[1] : null);

            let methodBadgeHtml = '';
            if (rawMethod === 'PAYOS' || payosCode) {
              methodBadgeHtml = `<span class="badge-inline" style="background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; font-weight:800"><i class="fa-solid fa-qrcode"></i> PayOS</span>`;
            } else if (rawMethod === 'TRANSFER' || rawMethod === 'BANKING') {
              methodBadgeHtml = `<span class="badge-inline" style="background:linear-gradient(135deg, #0d9488, #059669); color:#fff; font-weight:800"><i class="fa-solid fa-building-columns"></i> CK</span>`;
            } else {
              methodBadgeHtml = `<span class="badge-inline" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#fff; font-weight:800"><i class="fa-solid fa-money-bill-wave"></i> Tiền mặt</span>`;
            }

            return `
              <tr>
                <td><strong style="font-family:monospace; font-size:0.88rem; color:#0f172a">${escapeHtml(payment.transactionCode || `PAY-${payment.id}`)}</strong></td>
                <td>${payosCode ? `<span class="badge-inline" style="background:#e0f2fe; color:#0284c7; font-weight:800; font-family:monospace"><i class="fa-solid fa-qrcode"></i> #${payosCode}</span>` : '<span class="muted">-</span>'}</td>
                <td><span class="badge-inline" style="background:#eff6ff; color:#1d4ed8; font-weight:800">#${order.id || payment.order_id || '-'}</span></td>
                <td><strong>${escapeHtml(customerName)}</strong></td>
                <td><strong style="color:#15803d; font-size:0.95rem">${formatCurrency(payment.amount)}</strong></td>
                <td>${methodBadgeHtml}</td>
                <td>${statusChip(rawStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILED', rawStatus === 'SUCCESS' ? 'Thành công' : 'Thất bại')}</td>
                <td><span style="font-size:0.82rem; color:#475569">${formatDateTime(payment.paidAt || payment.created_at)}</span></td>
                <td style="text-align:right">
                  <div class="row-actions" style="justify-content:flex-end">
                    <button class="btn btn-ghost btn-small" data-action="toggle-payment-detail" data-id="${payment.id}" title="Xem chi tiết món"><i class="fa-solid fa-eye"></i> Chi tiết</button>
                    <button class="btn btn-danger btn-small" data-action="delete-record" data-view="payments" data-id="${payment.id}" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr class="hidden" data-payment-detail="${payment.id}">
                <td colspan="9" style="background:#f8fafc; padding:0.85rem 1.25rem">
                  <div style="font-size:0.82rem; font-weight:800; color:#1e293b; margin-bottom:0.4rem">Món ăn trong hóa đơn:</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:0.5rem">
                    ${(order.OrderItems || []).map(item => `
                      <div style="background:#fff; border:1px solid #e2e8f0; padding:0.4rem 0.6rem; border-radius:8px; display:flex; justify-content:space-between; font-size:0.8rem">
                        <span>${escapeHtml(item.Product?.name || `#${item.product_id}`)} <strong>x${item.quantity}</strong></span>
                        <strong>${formatCurrency(item.totalPrice || 0)}</strong>
                      </div>
                    `).join('') || '<div class="muted">Không có chi tiết sản phẩm</div>'}
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderEntityRow(view, record) {
  const config = ENTITY_CONFIGS[view];
  const cells = config.columns.map(column => `<td>${column.render(record)}</td>`).join('');
  return `
    <tr>
      ${cells}
      <td>
        <div class="row-actions">
          ${config.allowEdit ? `<button class="btn btn-secondary btn-small" data-action="edit-record" data-view="${view}" data-id="${record.id}">Sửa</button>` : ''}
          ${config.allowDelete ? `<button class="btn btn-danger btn-small" data-action="delete-record" data-view="${view}" data-id="${record.id}">Xóa</button>` : ''}
          ${renderCustomRowActions(view, record)}
        </div>
      </td>
    </tr>
  `;
}

function renderCustomRowActions(view, record) {
  if (view === 'tables') {
    return `
      <select class="inline-input" style="width:auto" data-action="table-status-select" data-id="${record.id}">
        ${['AVAILABLE', 'BOOKED', 'OCCUPIED', 'CLEANING'].map(status => `<option value="${status}" ${String(record.status).toUpperCase() === status ? 'selected' : ''}>${status}</option>`).join('')}
      </select>
      <button class="btn btn-secondary btn-small" data-action="save-table-status" data-id="${record.id}">Cập nhật</button>
    `;
  }

  if (view === 'reservations') {
    return `
      <button class="btn btn-secondary btn-small" data-action="reservation-checkin" data-id="${record.id}">Check-in</button>
      <button class="btn btn-ghost btn-small" data-action="reservation-cancel" data-id="${record.id}">Hủy</button>
    `;
  }

  if (view === 'products') {
    return `<span class="badge-inline">#${record.id}</span>`;
  }

  return '';
}

function renderOrdersTable(records) {
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><i class="fa-solid fa-receipt" style="color:#2563eb"></i> Mã đơn</th>
            <th><i class="fa-solid fa-user" style="color:#64748b"></i> Khách</th>
            <th><i class="fa-solid fa-chair" style="color:#004ac6"></i> Bàn</th>
            <th><i class="fa-solid fa-money-bill-wave" style="color:#16a34a"></i> Tổng tiền</th>
            <th><i class="fa-solid fa-credit-card" style="color:#8b5cf6"></i> Thanh toán</th>
            <th><i class="fa-solid fa-clock-rotate-left" style="color:#f59e0b"></i> Trạng thái</th>
            <th style="text-align:right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${records.map(record => {
            const tInfo = getOrderTableInfo(record, state.data.tables);
            const customerName = record.User?.fullName || record.user_id ? (record.User?.fullName || `#${record.user_id}`) : 'Khách vãng lai';
            return `
            <tr>
              <td><strong style="color:#0f172a; font-family:monospace; font-size:0.9rem">#${record.id}</strong></td>
              <td><strong>${escapeHtml(customerName)}</strong></td>
              <td><span class="badge-inline" style="background:#e0f2fe; color:#004ac6; font-weight:800"><i class="fa-solid ${tInfo.isTakeaway ? 'fa-bag-shopping' : 'fa-chair'}"></i> ${tInfo.label}</span></td>
              <td><strong style="color:#15803d; font-size:0.95rem">${formatCurrency(record.finalPrice ?? record.totalPrice)}</strong></td>
              <td>${statusChip(paymentStatusClass(record.paymentStatus), record.paymentStatus)}</td>
              <td>
                <select class="inline-input" style="width:auto; font-weight:700" data-action="order-status-select" data-id="${record.id}">
                  ${['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map(status => `<option value="${status}" ${String(record.status).toUpperCase() === status ? 'selected' : ''}>${status}</option>`).join('')}
                </select>
              </td>
              <td style="text-align:right">
                <div class="row-actions" style="justify-content:flex-end">
                  <button class="btn btn-secondary btn-small" data-action="save-order-status" data-id="${record.id}">Lưu</button>
                  <button class="btn btn-primary btn-small" data-action="open-admin-checkout" data-id="${record.id}" data-table="${tInfo.tableNumber || ''}" data-customer="${escapeHtml(customerName)}" data-amount="${record.finalPrice ?? record.totalPrice}" data-items="${(record.OrderItems || []).length}" data-status="${String(record.status || 'PENDING').toUpperCase()}">Thanh toán</button>
                  <button class="btn btn-danger btn-small" data-action="delete-record" data-view="orders" data-id="${record.id}">Xóa</button>
                  <button class="btn btn-ghost btn-small" data-action="toggle-order-detail" data-id="${record.id}">Chi tiết</button>
                </div>
              </td>
            </tr>
            <tr class="hidden" data-order-detail="${record.id}">
              <td colspan="7" style="background:#f8fafc">
                <div class="mini-card" style="margin:0">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; padding-bottom:0.4rem; border-bottom:1px dashed #cbd5e1">
                    <h4 class="mini-card-title" style="margin:0">Chi tiết đơn #${record.id}</h4>
                    <span class="badge-inline" style="background:#e0f2fe; color:#004ac6; font-weight:800"><i class="fa-solid ${tInfo.isTakeaway ? 'fa-bag-shopping' : 'fa-chair'}"></i> ${tInfo.label}</span>
                  </div>
                  <p class="mini-card-copy">${escapeHtml(record.note || 'Không có ghi chú')}</p>
                  <div class="info-list" style="margin-top:0.8rem">
                    ${(record.OrderItems || []).map(item => `
                      <div class="info-row">
                        <strong>${escapeHtml(item.Product?.name || `#${item.product_id}`)} x${item.quantity}</strong>
                        <span>${formatCurrency(item.totalPrice || 0)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderReviewsTable(records) {
  const list = Array.isArray(records?.reviews) ? records.reviews : records;
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th><i class="fa-solid fa-user" style="color:#3b82f6"></i> Người đánh giá</th>
            <th><i class="fa-solid fa-bowl-food" style="color:#f59e0b"></i> Món ăn</th>
            <th><i class="fa-solid fa-comment" style="color:#64748b"></i> Nội dung đánh giá</th>
            <th><i class="fa-solid fa-reply" style="color:#2563eb"></i> Phản hồi Nhà hàng</th>
            <th><i class="fa-solid fa-star" style="color:#eab308"></i> Số sao</th>
            <th><i class="fa-regular fa-clock" style="color:#64748b"></i> Ngày tạo</th>
            <th style="text-align:right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(record => {
            const isHidden = String(record.status || 'VISIBLE').toUpperCase() === 'HIDDEN';
            return `
            <tr>
              <td><strong>${escapeHtml(record.user?.fullName || record.phone || 'Khách vãng lai')}</strong></td>
              <td>${record.dish_name ? `<span class="review-dish-tag"><i class="fa-solid fa-bowl-food"></i> ${escapeHtml(record.dish_name)}</span>` : '-'}</td>
              <td><span style="color:#334155; font-style:italic">"${escapeHtml(record.content || 'Khách không để lại nhận xét.')}"</span></td>
              <td>${record.reply ? `<span style="color:#1d4ed8; font-weight:600">${escapeHtml(record.reply)}</span>` : '<span class="muted">Chưa phản hồi</span>'}</td>
              <td><span style="color:#eab308; font-weight:800">${'★'.repeat(record.rating || 0)}</span></td>
              <td><span style="font-size:0.82rem; color:#64748b">${escapeHtml(formatDateTime(record.created_at || record.createdAt))}</span></td>
              <td style="text-align:right">
                <div class="row-actions" style="justify-content:flex-end">
                  <button class="btn btn-primary btn-small" data-action="reply-review" data-id="${record.id}" data-reply="${escapeHtml(record.reply || '')}"><i class="fa-solid fa-reply"></i> Phản hồi</button>
                  <button class="btn btn-secondary btn-small" data-action="toggle-review-status" data-id="${record.id}" data-status="${isHidden ? 'VISIBLE' : 'HIDDEN'}">${isHidden ? 'Hiện' : 'Ẩn'}</button>
                  <button class="btn btn-danger btn-small" data-action="delete-record" data-view="reviews" data-id="${record.id}"><i class="fa-solid fa-trash"></i> Xóa</button>
                </div>
              </td>
            </tr>
          `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderModal() {
  if (!state.modal) return '';
  if (state.modal.kind === 'generic-form') {
    return `
      <div class="modal-backdrop" data-action="close-modal">
        <div class="modal-card" data-action="stop-propagation">
          <div class="modal-head">
            <div>
              <h3 class="modal-title">${escapeHtml(state.modal.title)}</h3>
              <div class="subtle">${escapeHtml(state.modal.subtitle || '')}</div>
            </div>
            <button class="btn btn-ghost btn-small" data-action="close-modal">Đóng</button>
          </div>
          <form class="modal-body" data-form="entity" data-view="${state.modal.view}" data-mode="${state.modal.mode}" data-id="${state.modal.record?.id || ''}">
            ${renderEntityFields(state.modal.view, state.modal.record)}
            <div class="modal-actions">
              <button type="submit" class="btn btn-primary">${state.modal.mode === 'edit' ? 'Lưu thay đổi' : 'Tạo mới'}</button>
              <button type="button" class="btn btn-secondary" data-action="close-modal">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  if (state.modal.kind === 'user-detail') {
    return renderUserDetailModal(state.modal.record);
  }

  if (state.modal.kind === 'order-form') {
    return renderOrderModal();
  }

  if (state.modal.kind === 'reservation-form') {
    return renderReservationModal();
  }

  if (state.modal.kind === 'bulk-tables') {
    return renderTableBulkModal();
  }

  if (state.modal.kind === 'table-qr') {
    return renderTableQrModal(state.modal.record);
  }

  return '';
}

function renderTableQrModal(tableData) {
  if (!tableData) return '';
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card" data-action="stop-propagation" style="max-width:440px; text-align:center">
        <div class="modal-head">
          <div>
            <h3 class="modal-title"><i class="fa-solid fa-qrcode text-accent" style="margin-right:0.4rem"></i>Mã QR Bàn #${escapeHtml(tableData.number)}</h3>
            <div class="subtle">Quét mã QR để truy cập thực đơn và đặt món trực tuyến</div>
          </div>
          <button class="btn btn-ghost btn-small" data-action="close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="padding:1rem 0; display:grid; gap:1.1rem">
          <div style="background:#ffffff; padding:1.4rem; border-radius:22px; border:2px solid #3b82f6; box-shadow:0 10px 30px rgba(0,74,198,0.12)">
            <div style="font-weight:900; font-size:1.15rem; color:#004ac6; margin-bottom:0.2rem; letter-spacing:0.5px">FUTURESUSHI RESTAURANT</div>
            <div style="font-size:0.8rem; color:#64748b; margin-bottom:0.9rem">Hệ Thống Đặt Món Thông Minh Tại Bàn</div>
            <img src="${escapeHtml(tableData.img)}" alt="Mã QR Bàn #${escapeHtml(tableData.number)}" style="width:220px; height:220px; border-radius:14px; margin:0 auto; display:block; border:1px solid #cbd5e1; box-shadow:0 4px 14px rgba(0,0,0,0.06)" />
            <div style="margin-top:0.9rem; font-weight:800; font-size:1.1rem; color:#111c2d">Bàn #${escapeHtml(tableData.number)} • Sức chứa ${escapeHtml(tableData.capacity || 4)} người</div>
            <div style="font-size:0.82rem; color:#64748b; margin-top:0.2rem">Mã định danh: <code>${escapeHtml(tableData.code || `T${tableData.number}`)}</code></div>
            <code style="display:block; margin-top:0.6rem; background:#f1f5f9; padding:0.45rem; border-radius:8px; font-size:0.75rem; word-break:break-all; border:1px solid #e2e8f0">${escapeHtml(tableData.url)}</code>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem">
            <button type="button" class="btn btn-secondary" data-action="copy-table-url" data-url="${escapeHtml(tableData.url)}" style="padding:0.65rem; font-size:0.88rem"><i class="fa-regular fa-copy"></i> Sao chép link</button>
            <a class="btn btn-primary" href="${escapeHtml(tableData.img)}" download="QR_Ban_${tableData.number}.png" target="_blank" style="padding:0.65rem; font-size:0.88rem"><i class="fa-solid fa-download"></i> Tải ảnh QR</a>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem">
            <button type="button" class="btn btn-secondary" onclick="window.print()" style="padding:0.65rem; font-size:0.88rem"><i class="fa-solid fa-print"></i> In mã QR</button>
            <a class="btn btn-ghost" href="${escapeHtml(tableData.url)}" target="_blank" style="padding:0.65rem; font-size:0.88rem; border:1px solid #cbd5e1"><i class="fa-solid fa-arrow-up-right-from-square"></i> Mở Menu Web</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderUserDetailModal(user) {
  if (!user) return '';
  const initials = userInitials(user);
  const role = String(user.role || 'CUSTOMER').toUpperCase();
  const isBlocked = String(user.status || 'ACTIVE').toUpperCase() === 'BLOCKED';

  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card" data-action="stop-propagation" style="max-width:540px">
        <div class="modal-head">
          <div>
            <h3 class="modal-title">Thông tin chi tiết người dùng</h3>
            <div class="subtle">Mã tài khoản #${user.id}</div>
          </div>
          <button class="btn btn-ghost btn-small" data-action="close-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="display:grid; gap:1.2rem">
          <div style="display:flex; align-items:center; gap:1.2rem; background:#f8fafc; padding:1.2rem; border-radius:18px; border:1px solid rgba(115,118,134,0.16)">
            <div class="user-card-avatar" style="width:64px; height:64px; font-size:1.5rem">
              ${user.avatar ? `<img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.fullName)}" />` : initials}
            </div>
            <div>
              <h4 style="margin:0; font-size:1.2rem; font-weight:800; color:#111c2d">${escapeHtml(user.fullName || 'Người dùng')}</h4>
              <div style="color:#5f748d; font-size:0.88rem; margin-top:0.2rem">@${escapeHtml(user.username || 'user')}</div>
              <div style="display:flex; gap:0.5rem; margin-top:0.5rem">
                ${statusChip(role, role)}
                ${statusChip(isBlocked ? 'blocked' : 'active', isBlocked ? 'Bị khóa' : 'Hoạt động')}
              </div>
            </div>
          </div>

          <div class="info-list">
            <div class="info-row">
              <strong>Số điện thoại</strong>
              <span>${escapeHtml(user.phone || 'Chưa cập nhật')}</span>
            </div>
            <div class="info-row">
              <strong>Email liên hệ</strong>
              <span>${escapeHtml(user.email || 'Chưa cập nhật')}</span>
            </div>
            <div class="info-row">
              <strong>Điểm tích lũy</strong>
              <strong style="color:#b45309">⭐ ${formatNumber(user.points ?? 0)} điểm</strong>
            </div>
            <div class="info-row">
              <strong>Ngày tạo tài khoản</strong>
              <span>${formatDateTime(user.createdAt || user.created_at)}</span>
            </div>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:1rem">
          <button class="btn btn-secondary" data-action="edit-record" data-view="users" data-id="${user.id}"><i class="fa-solid fa-pen"></i> Chỉnh sửa</button>
          <button class="btn btn-primary" data-action="close-modal">Đóng</button>
        </div>
      </div>
    </div>
  `;
}

function renderEntityFields(view, record) {
  const config = ENTITY_CONFIGS[view];
  const payload = config.payload ? config.payload(record || {}) : {};

  return `
    <div class="modal-grid">
      ${config.fields.map(field => renderField(view, field, payload[field.name], record)).join('')}
    </div>
  `;
}

function renderField(view, field, value, record) {
  if (field.onlyOnEdit && !record) return '';
  if (field.requiredOnCreate && record) {
    field = { ...field, required: false };
  }

  if (field.type === 'checkbox') {
    return `
      <div class="field">
        <label>
          <input type="checkbox" name="${field.name}" ${value ? 'checked' : ''} />
          ${escapeHtml(field.label)}
        </label>
        ${field.helper ? `<div class="form-hint">${escapeHtml(field.helper)}</div>` : ''}
      </div>
    `;
  }

  if (field.type === 'select') {
    const options = typeof field.options === 'function' ? field.options(state) : field.options;
    return `
      <div class="field">
        <label for="${field.name}">${escapeHtml(field.label)}</label>
        <select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
          ${field.placeholder ? `<option value="">${escapeHtml(field.placeholder)}</option>` : ''}
          ${(options || []).map(option => {
            if (typeof option === 'string') {
              return `<option value="${escapeHtml(option)}" ${String(value) === option ? 'selected' : ''}>${escapeHtml(option)}</option>`;
            }
            return `<option value="${escapeHtml(option.value)}" ${String(value) === String(option.value) ? 'selected' : ''}>${escapeHtml(option.label)}</option>`;
          }).join('')}
        </select>
        ${field.helper ? `<div class="form-hint">${escapeHtml(field.helper)}</div>` : ''}
      </div>
    `;
  }

  if (field.type === 'textarea') {
    return `
      <div class="field full">
        <label for="${field.name}">${escapeHtml(field.label)}</label>
        <textarea id="${field.name}" name="${field.name}" placeholder="${escapeHtml(field.placeholder || '')}" ${field.required ? 'required' : ''}>${escapeHtml(value || '')}</textarea>
        ${field.helper ? `<div class="form-hint">${escapeHtml(field.helper)}</div>` : ''}
      </div>
    `;
  }

  if (field.type === 'image') {
    return `
      <div class="field full">
        <label for="${field.name}">${escapeHtml(field.label)}</label>
        <input id="${field.name}" name="${field.name}" type="text" value="${escapeHtml(value || '')}" placeholder="/uploads/... hoặc URL ảnh" />
        <input name="${field.name}File" type="file" accept="image/*" />
        <div class="form-hint">Chọn file để upload tự động hoặc dán trực tiếp URL ảnh.</div>
        ${value ? `<div class="image-preview"><img src="${escapeHtml(value)}" alt="${escapeHtml(field.label)}" /></div>` : ''}
      </div>
    `;
  }

  const inputType = field.type === 'datetime-local' ? 'datetime-local' : field.type;
  const inputValue = field.type === 'datetime-local' ? toDatetimeLocal(value) : value ?? '';

  return `
    <div class="field ${field.full ? 'full' : ''}">
      <label for="${field.name}">${escapeHtml(field.label)}</label>
      <input
        id="${field.name}"
        name="${field.name}"
        type="${inputType}"
        value="${escapeHtml(inputValue)}"
        ${field.min !== undefined ? `min="${field.min}"` : ''}
        ${field.step ? `step="${field.step}"` : ''}
        ${field.required ? 'required' : ''}
        placeholder="${escapeHtml(field.placeholder || '')}"
      />
      ${field.helper ? `<div class="form-hint">${escapeHtml(field.helper)}</div>` : ''}
    </div>
  `;
}

function toDatetimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function renderOrderModal() {
  const tables = state.data.tables || [];
  const products = state.data.products || [];
  const users = Array.isArray(state.data.users) ? state.data.users : [];
  const vouchers = Array.isArray(state.data.vouchers) ? state.data.vouchers.filter(v => v.isActive !== false) : [];
  const orders = Array.isArray(state.data.orders) ? state.data.orders : [];
  const prefill = state.modal?.prefill || {};

  // Kiểm tra bàn được chọn có đang có đơn chưa thanh toán không
  const activeTableOrder = prefill.table_id ? orders.find(o =>
    String(o.table_id) === String(prefill.table_id) &&
    String(o.paymentStatus).toUpperCase() !== 'PAID' &&
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(String(o.status).toUpperCase())
  ) : null;

  const selectedMember = prefill.user_id ? users.find(u => String(u.id) === String(prefill.user_id)) : (activeTableOrder?.user_id ? users.find(u => String(u.id) === String(activeTableOrder.user_id)) : null);
  const initialUserId = selectedMember ? selectedMember.id : (prefill.user_id || '');
  const initialPhone = selectedMember?.phone || prefill.phone || '';

  const defaultItems = [
    { product_id: products[0]?.id || '', quantity: 1, note: '' }
  ];

  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card" data-action="stop-propagation" style="max-width:760px">
        <div class="modal-head">
          <div>
            <h3 class="modal-title">Tạo / Bổ sung đơn hàng POS (Tìm kiếm Thành viên gần đúng & Chống chồng đơn)</h3>
            <div class="subtle">Gõ Tên hoặc SĐT gần đúng để hiển thị danh sách khách hàng thành viên, click chọn để tự động điền các trường xung quanh. Nếu bàn đang có đơn mở, hệ thống sẽ tự động gộp món & đồng bộ khách hàng vào đơn hiện tại.</div>
          </div>
          <button class="btn btn-ghost btn-small" data-action="close-modal">Đóng</button>
        </div>

        <form class="modal-body" data-form="order-create">
          <div id="posTableActiveOrderBanner" style="display:${activeTableOrder ? 'block' : 'none'}; padding:0.75rem 1rem; border-radius:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; font-size:0.84rem; margin-bottom:0.4rem">
            ${activeTableOrder ? `<i class="fa-solid fa-layer-group"></i> <strong>Bàn này đang có Đơn #${activeTableOrder.id} (${activeTableOrder.status} • ${formatCurrency(activeTableOrder.finalPrice ?? activeTableOrder.totalPrice)})</strong> — Món mới và thông tin Thành viên/Vãng lai bạn chọn bên dưới sẽ được <strong>gộp trực tiếp vào Đơn #${activeTableOrder.id}</strong> (không bị tạo đơn chồng)!` : ''}
          </div>

          <div class="modal-grid">
            <div class="field">
              <label for="orderTable">Vị trí Bàn ăn (Tự động đồng bộ khách đặt bàn & đơn đang mở)</label>
              <select id="orderTable" name="table_id" data-action="pos-order-table-change">
                <option value="">Khách mang đi (Takeaway) / Chưa gán bàn</option>
                ${tables.map(table => `<option value="${table.id}" ${String(prefill.table_id) === String(table.id) ? 'selected' : ''}>Bàn #${table.tableNumber} • ${escapeHtml(table.calculatedStatus || table.status)} (${table.capacity || 4} chỗ)</option>`).join('')}
              </select>
            </div>

            <div class="field" style="position:relative">
              <label for="posMemberSearchInput"><i class="fa-solid fa-magnifying-glass" style="color:#2563eb"></i> Tìm kiếm Tên hoặc SĐT gần đúng của Thành viên</label>
              <input id="posMemberSearchInput" type="search" data-action="pos-member-search" value="${escapeHtml(selectedMember ? `${selectedMember.fullName} (${selectedMember.phone})` : '')}" placeholder="Gõ ký tự tên hoặc SĐT gần đúng (VD: Nguyễn, VIP, 090...)" autocomplete="off" />
              <div id="posMemberSuggestList" style="display:none; position:absolute; top:100%; left:0; right:0; z-index:99; max-height:210px; overflow-y:auto; background:#ffffff; border:1px solid #cbd5e1; border-radius:12px; box-shadow:0 12px 28px rgba(15,23,42,0.16); margin-top:4px; padding:0.35rem"></div>
            </div>

            <div class="field">
              <label for="orderCustomerSelect">Khách hàng áp dụng cho đơn (Thành viên / Vãng lai)</label>
              <select id="orderCustomerSelect" name="user_id" data-action="pos-customer-select-change">
                <option value="">👤 Khách vãng lai (Không tích điểm)</option>
                ${users.map(u => `<option value="${u.id}" data-name="${escapeHtml(u.fullName || u.username)}" data-phone="${escapeHtml(u.phone || '')}" data-tier="${escapeHtml(u.tier || 'MEMBER')}" data-points="${Number(u.points || 0)}" data-search="${escapeHtml(`${u.fullName || ''} ${u.phone || ''} ${u.username || ''} ${u.email || ''}`.toLowerCase())}" ${String(initialUserId) === String(u.id) ? 'selected' : ''}>⭐ ${escapeHtml(u.fullName || u.username)} (${escapeHtml(u.phone || '-')}) • Hạng ${escapeHtml(u.tier || 'MEMBER')} • ${formatNumber(u.points || 0)} điểm</option>`).join('')}
              </select>
            </div>

            <div class="field">
              <label for="orderCustomerPhone">Số điện thoại Khách hàng (Tự động cập nhật khi chọn)</label>
              <input id="orderCustomerPhone" name="customerPhone" type="text" value="${escapeHtml(initialPhone)}" placeholder="SĐT thành viên tự động điền hoặc nhập tại đây..." />
            </div>

            <div class="field full" id="posSelectedMemberInfoCard" style="margin-top:-0.25rem">
              ${selectedMember ? `
                <div style="padding:0.65rem 0.9rem; border-radius:12px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; font-size:0.84rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem">
                  <div><strong>⭐ Đã chọn Thành viên: ${escapeHtml(selectedMember.fullName)}</strong> • SĐT: <strong>${escapeHtml(selectedMember.phone || '-')}</strong></div>
                  <div>Hạng thẻ: <span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800">${escapeHtml(selectedMember.tier || 'MEMBER')}</span> • Điểm khả dụng: <strong>${formatNumber(selectedMember.points || 0)} điểm</strong></div>
                </div>
              ` : `
                <div style="padding:0.55rem 0.9rem; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; color:#64748b; font-size:0.82rem">
                  👤 Đang chọn: <strong>Khách vãng lai</strong> (Gõ Tên hoặc SĐT vào ô Tìm kiếm bên trên để chọn Thành viên tích điểm)
                </div>
              `}
            </div>

            <div class="field">
              <label for="orderVoucherCode">Mã giảm giá (Voucher Khuyến mãi)</label>
              <select id="orderVoucherCode" name="voucherCode">
                <option value="">-- Không dùng Voucher --</option>
                ${vouchers.map(v => `<option value="${escapeHtml(v.code)}">🎟️ ${escapeHtml(v.code)} — Giảm ${v.discountType === 'PERCENT' ? `${v.discountValue}%` : formatCurrency(v.discountValue)} (Đơn từ ${formatCurrency(v.minOrderValue || 0)})</option>`).join('')}
              </select>
            </div>

            <div class="field">
              <label for="orderPoints">Dùng điểm tích lũy của Thành viên (1 điểm = 1₫)</label>
              <input id="orderPoints" name="used_points" type="number" min="0" max="${selectedMember ? Number(selectedMember.points || 0) : 9999999}" step="1000" value="0" />
            </div>

            <div class="field full">
              <label for="orderNote">Ghi chú đơn hàng</label>
              <input id="orderNote" name="note" type="text" placeholder="Ghi chú cho bếp hoặc thu ngân (VD: ít cay...)" />
            </div>
          </div>

          <div>
            <div class="section-head" style="margin-bottom:0.6rem">
              <div>
                <h4 class="section-title" style="font-size:1.08rem">Danh sách món trong đơn</h4>
                <p class="section-description">Chọn món, số lượng và ghi chú riêng cho từng món.</p>
              </div>
              <button type="button" class="btn btn-secondary btn-small" data-action="add-order-item"><i class="fa-solid fa-plus"></i> Thêm món</button>
            </div>
            <div class="card-list" data-order-items>
              ${defaultItems.map((item, index) => renderOrderItemRow(index, item)).join('')}
            </div>
          </div>

          <div class="note-box">💡 Khi thanh toán đơn hàng của Thành viên, hệ thống sẽ tự động cộng điểm tích lũy (+5% giá trị đơn) và tự động xét nâng hạng thẻ (SILVER / GOLD / VIP).</div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary"><i class="fa-solid fa-check"></i> Tạo đơn hàng</button>
            <button type="button" class="btn btn-secondary" data-action="close-modal">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderOrderItemRow(index, item = {}) {
  const products = state.data.products || [];
  return `
    <div class="item-row" data-order-item="${index}">
      <div class="field">
        <label>Sản phẩm</label>
        <select name="product_id">
          ${products.map(product => `<option value="${product.id}" ${String(item.product_id) === String(product.id) ? 'selected' : ''}>${escapeHtml(product.name)} • ${formatCurrency(product.price)}</option>`).join('')}
        </select>
      </div>
      <div class="field small">
        <label>Số lượng</label>
        <input name="quantity" type="number" min="1" step="1" value="${item.quantity || 1}" />
      </div>
      <div class="field">
        <label>Ghi chú</label>
        <input name="note" type="text" value="${escapeHtml(item.note || '')}" placeholder="Ví dụ: ít cay" />
      </div>
      <button type="button" class="btn btn-danger btn-small" data-action="remove-order-item">Xóa</button>
    </div>
  `;
}

function renderReservationModal() {
  const users = state.data.users || [];
  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card" data-action="stop-propagation">
        <div class="modal-head">
          <div>
            <h3 class="modal-title">Thêm đặt bàn</h3>
            <div class="subtle">Tạo lịch đặt mới qua endpoint hiện có của backend.</div>
          </div>
          <button class="btn btn-ghost btn-small" data-action="close-modal">Đóng</button>
        </div>

        <form class="modal-body" data-form="reservation-create">
          <div class="modal-grid">
            <div class="field">
              <label for="guestName">Tên khách</label>
              <input id="guestName" name="guestName" type="text" required />
            </div>
            <div class="field">
              <label for="guestPhone">Số điện thoại</label>
              <input id="guestPhone" name="guestPhone" type="text" required />
            </div>
            <div class="field">
              <label for="reservationTime">Thời gian</label>
              <input id="reservationTime" name="reservationTime" type="datetime-local" required />
            </div>
            <div class="field">
              <label for="numberOfGuests">Số khách</label>
              <input id="numberOfGuests" name="numberOfGuests" type="number" min="1" step="1" value="1" required />
            </div>
            <div class="field">
              <label for="user_id">Tài khoản liên kết</label>
              <select id="user_id" name="user_id">
                <option value="">Không liên kết</option>
                ${users.map(user => `<option value="${user.id}">${escapeHtml(user.fullName)} • ${escapeHtml(user.phone)}</option>`).join('')}
              </select>
            </div>
            <div class="field full">
              <label for="note">Ghi chú</label>
              <textarea id="note" name="note"></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">Tạo đặt bàn</button>
            <button type="button" class="btn btn-secondary" data-action="close-modal">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderTableBulkModal() {
  const template = JSON.stringify([
    { tableNumber: 1, qrCode: 'T1-001', capacity: 4, status: 'AVAILABLE' },
    { tableNumber: 2, qrCode: 'T2-002', capacity: 4, status: 'AVAILABLE' }
  ], null, 2);

  return `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal-card" data-action="stop-propagation">
        <div class="modal-head">
          <div>
            <h3 class="modal-title">Nạp bàn hàng loạt</h3>
            <div class="subtle">Backend hiện tại chỉ hỗ trợ bulk create cho bàn, nên form này gửi một mảng JSON.</div>
          </div>
          <button class="btn btn-ghost btn-small" data-action="close-modal">Đóng</button>
        </div>

        <form class="modal-body" data-form="table-bulk-create">
          <div class="note-box">Mỗi phần tử cần có <strong>tableNumber</strong>, <strong>qrCode</strong>, <strong>capacity</strong> và <strong>status</strong>.</div>
          <div class="field full">
            <label for="tableBulkJson">JSON danh sách bàn</label>
            <textarea id="tableBulkJson" name="tableBulkJson">${escapeHtml(template)}</textarea>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">Nạp dữ liệu</button>
            <button type="button" class="btn btn-secondary" data-action="close-modal">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderToast(item) {
  return `
    <div class="toast">
      <h4 class="toast-title">${escapeHtml(item.title)}</h4>
      <p class="toast-text">${escapeHtml(item.text)}</p>
    </div>
  `;
}

function renderToasts() {
  const existing = app.querySelector('.toast-stack');
  if (!existing) return;
  existing.innerHTML = state.toast.map(renderToast).join('');
}

function bindLogin() {
  const form = app.querySelector('[data-form="login"]');
  if (!form) return;

  const toggleBtn = app.querySelector('#toggle-pw');
  const passwordInput = app.querySelector('#password');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      }
    });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const formData = new FormData(form);
    const account = String(formData.get('account') || '').trim();
    const password = String(formData.get('password') || '');

    try {
      const result = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ account, password })
      });
      persistAuth(result.token, result.user);
      toast('success', 'Đăng nhập thành công', `Xin chào ${result.user.fullName || result.user.username}`);
      await boot();
    } catch (error) {
      toast('danger', 'Đăng nhập thất bại', error.message || 'Không thể xác thực tài khoản.');
    }
  });
}

function bindGlobalEvents() {
  app.onclick = async event => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const view = target.dataset.view;
    const id = target.dataset.id;

    if (action !== 'close-modal' && action !== 'stop-propagation') {
      event.preventDefault();
    }

    if (action === 'stop-propagation') {
      event.stopPropagation();
      return;
    }

    try {
      switch (action) {
        case 'switch-view':
          state.activeView = view;
          render();
          break;
        case 'logout':
          clearAuth();
          toast('success', 'Đã đăng xuất', 'Phiên quản trị đã được xóa khỏi trình duyệt.');
          render();
          break;
        case 'refresh-all':
          state.loading = true;
          render();
          await loadAllData();
          state.loading = false;
          render();
          break;
        case 'create-record':
          openCreateModal(view);
          break;
        case 'edit-record':
          openEditModal(view, id);
          break;
        case 'delete-record':
          await deleteRecord(view, id);
          break;
        case 'close-modal':
          state.modal = null;
          render();
          break;
        case 'stats-reset':
          state.statsQuery = { type: 'day', date: '' };
          state.loading = true;
          render();
          await loadAllData();
          state.loading = false;
          render();
          break;
        case 'reservation-confirm':
          await simpleAction(`/api/reservations/${id}/confirm`, { method: 'PUT' }, 'Đã xác nhận đặt bàn thành công');
          break;
        case 'reservation-checkin': {
          const tableSelect = app.querySelector(`select[data-res-table-select="${id}"]`);
          const chosenTableId = tableSelect?.value ? Number(tableSelect.value) : null;
          await simpleAction(`/api/reservations/${id}/check-in`, {
            method: 'PUT',
            body: JSON.stringify({ force: true, table_id: chosenTableId })
          }, 'Đã Check-in nhận bàn thành công');
          break;
        }
        case 'reservation-cancel':
          await simpleAction(`/api/reservations/${id}/cancel`, { method: 'PUT' }, 'Đã hủy đặt bàn');
          break;
        case 'reply-review': {
          const currentReply = target.dataset.reply || '';
          const replyText = window.prompt('Nhập nội dung phản hồi của Nhà hàng FutureSushi cho đánh giá này:', currentReply);
          if (replyText === null) break;
          await simpleAction(`/api/reviews/${id}/reply`, {
            method: 'PUT',
            body: JSON.stringify({ reply: replyText })
          }, 'Đã lưu phản hồi của nhà hàng thành công!');
          break;
        }
        case 'toggle-review-status': {
          const nextStatus = target.dataset.status || 'HIDDEN';
          await simpleAction(`/api/reviews/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: nextStatus })
          }, nextStatus === 'HIDDEN' ? 'Đã ẩn đánh giá' : 'Đã hiển thị lại đánh giá');
          break;
        }
        case 'print-vat-invoice': {
          const orderId = app.querySelector('#erp-print-order-id')?.value;
          if (!orderId) {
            toast('warning', 'Chưa chọn đơn', 'Vui lòng chọn mã đơn hàng cần in hóa đơn VAT.');
            break;
          }
          const order = await api(`/api/orders/${orderId}`);
          const sub = Number(order.totalPrice || 0);
          const disc = Number(order.discountAmount || 0);
          const vat = Math.round(Math.max(0, sub - disc) * 0.08);
          const total = Number(order.finalPrice || 0) + (order.vatAmount ? 0 : vat);
          const win = window.open('', '_blank', 'width=440,height=680');
          if (win) {
            win.document.write(`
              <html><head><title>Hóa đơn VAT #${order.id}</title>
              <style>body{font-family:monospace;padding:20px;line-height:1.5} table{width:100%;border-collapse:collapse} td,th{padding:4px 0;text-align:left} .right{text-align:right}</style>
              </head><body onload="window.print()">
                <h2 style="text-align:center;margin:0">FUTURESUSHI RESTAURANT</h2>
                <p style="text-align:center;margin:4px 0;font-size:12px">HÓA ĐƠN GIÁ TRỊ GIA TĂNG (VAT 8%)<br/>Mã HĐ: #${order.id} • Ngày: ${new Date(order.created_at || Date.now()).toLocaleString('vi-VN')}</p>
                <hr/>
                <div>Khách hàng: ${escapeHtml(order.User?.fullName || 'Khách vãng lai')}</div>
                <div>Vị trí: ${order.table_id ? 'Bàn #' + order.table_id : 'Mang đi / Giao hàng'}</div>
                <hr/>
                <table>
                  <thead><tr><th>Món ăn</th><th>SL</th><th class="right">Thành tiền</th></tr></thead>
                  <tbody>
                    ${(order.OrderItems || []).map(i => `<tr><td>${escapeHtml(i.Product?.name || 'Món #' + i.product_id)}</td><td>x${i.quantity}</td><td class="right">${formatCurrency(i.totalPrice)}</td></tr>`).join('')}
                  </tbody>
                </table>
                <hr/>
                <div>Tạm tính: <span style="float:right">${formatCurrency(sub)}</span></div>
                <div>Chiết khấu (Hạng thẻ / Điểm / Voucher): <span style="float:right">-${formatCurrency(disc)}</span></div>
                <div>Thuế GTGT (VAT 8%): <span style="float:right">${formatCurrency(vat)}</span></div>
                <h3 style="margin:8px 0">TỔNG THANH TOÁN: <span style="float:right">${formatCurrency(total)}</span></h3>
                <p style="text-align:center;font-size:12px;margin-top:20px">Cảm ơn Quý khách và hẹn gặp lại!</p>
              </body></html>
            `);
            win.document.close();
          }
          break;
        }
        case 'save-table-status': {
          const select = app.querySelector(`[data-action="table-status-select"][data-id="${id}"]`);
          const status = target.dataset.status || select?.value || 'AVAILABLE';
          await simpleAction(`/api/tables/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
          }, 'Đã cập nhật trạng thái bàn');
          break;
        }
        case 'order-status-select':
          break;
        case 'save-order-status': {
          const select = app.querySelector(`[data-action="order-status-select"][data-id="${id}"]`);
          const status = select?.value || 'PENDING';
          await simpleAction(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
          }, 'Đã cập nhật trạng thái đơn');
          break;
        }
        case 'open-admin-checkout': {
          const table = target.dataset.table;
          const customer = target.dataset.customer;
          const amount = target.dataset.amount;
          const items = target.dataset.items;
          const status = target.dataset.status;
          openAdminCheckoutModal(id, table, customer, amount, items, status);
          break;
        }
        case 'pay-order':
          await simpleAction(`/api/orders/${id}/pay`, {
            method: 'PUT',
            body: JSON.stringify({ paymentMethod: 'CASH' })
          }, 'Đơn đã được thanh toán');
          break;
        case 'toggle-payment-detail': {
          const detailBox = app.querySelector(`[data-payment-detail="${id}"]`);
          if (detailBox) detailBox.classList.toggle('hidden');
          break;
        }
        case 'table-status-select':
          break;
        case 'search-input':
          break;
        case 'clear-search':
          state.filters[view] = '';
          render();
          break;
        case 'quick-add-stock': {
          const product = (state.data.products || []).find(p => String(p.id) === String(id));
          const delta = Number(target.dataset.delta || 20);
          if (product) {
            const newStock = Math.max(0, Number(product.stock || 0) + delta);
            await simpleAction(`/api/products/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ ...product, stock: newStock, isAvailable: true })
            }, `Đã nạp thêm +${delta} suất cho "${product.name}" (Tồn mới: ${newStock} suất)`);
          }
          break;
        }
        case 'save-product-stock': {
          const product = (state.data.products || []).find(p => String(p.id) === String(id));
          const stockInput = app.querySelector(`input[data-stock-input="${id}"]`);
          if (product && stockInput) {
            const newStock = Math.max(0, Number(stockInput.value || 0));
            await simpleAction(`/api/products/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ ...product, stock: newStock, isAvailable: newStock > 0 })
            }, `Đã cập nhật tồn kho món "${product.name}" thành ${newStock} suất`);
          }
          break;
        }
        case 'create-order-for-table': {
          state.modal = {
            kind: 'order-form',
            prefill: {
              table_id: target.dataset.tableId || '',
              user_id: target.dataset.userId || '',
              phone: target.dataset.phone || ''
            }
          };
          render();
          break;
        }
        case 'slide-inventory-panel': {
          const targetSlide = target.dataset.target;
          const panelEl = app.querySelector(targetSlide === 'recipe' ? '#slide-panel-recipe' : '#slide-panel-barcode');
          if (panelEl) {
            panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          }
          break;
        }
        case 'select-pos-member-suggest': {
          const userId = target.dataset.userId;
          const userObj = (state.data.users || []).find(u => String(u.id) === String(userId));
          const selectEl = app.querySelector('#orderCustomerSelect');
          const phoneEl = app.querySelector('#orderCustomerPhone');
          const searchEl = app.querySelector('#posMemberSearchInput');
          const suggestBox = app.querySelector('#posMemberSuggestList');
          const pointsEl = app.querySelector('#orderPoints');
          const infoCard = app.querySelector('#posSelectedMemberInfoCard');

          if (userObj) {
            if (selectEl) selectEl.value = String(userObj.id);
            if (phoneEl) phoneEl.value = userObj.phone || '';
            if (searchEl) searchEl.value = `${userObj.fullName || userObj.username} (${userObj.phone || ''})`;
            if (pointsEl) {
              pointsEl.max = String(Number(userObj.points || 0));
            }
            if (infoCard) {
              infoCard.innerHTML = `
                <div style="padding:0.65rem 0.9rem; border-radius:12px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; font-size:0.84rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem">
                  <div><strong>⭐ Đã chọn Thành viên: ${escapeHtml(userObj.fullName || userObj.username)}</strong> • SĐT: <strong>${escapeHtml(userObj.phone || '-')}</strong></div>
                  <div>Hạng thẻ: <span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800">${escapeHtml(userObj.tier || 'MEMBER')}</span> • Điểm khả dụng: <strong>${formatNumber(userObj.points || 0)} điểm</strong></div>
                </div>
              `;
            }
          } else {
            if (selectEl) selectEl.value = '';
            if (phoneEl) phoneEl.value = '';
            if (searchEl) searchEl.value = '';
            if (infoCard) {
              infoCard.innerHTML = `
                <div style="padding:0.55rem 0.9rem; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; color:#64748b; font-size:0.82rem">
                  👤 Đang chọn: <strong>Khách vãng lai</strong> (Gõ Tên hoặc SĐT vào ô Tìm kiếm bên trên để chọn Thành viên tích điểm)
                </div>
              `;
            }
          }
          if (suggestBox) suggestBox.style.display = 'none';
          break;
        }
        case 'kitchen-update-status': {
          const nextStatus = target.dataset.status || 'PREPARING';
          await simpleAction(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: nextStatus })
          }, `Đã chuyển trạng thái Đơn #${id} sang ${nextStatus}`);
          break;
        }
        case 'kitchen-cancel-item': {
          const orderId = target.dataset.orderId;
          const itemId = target.dataset.itemId;
          const prodName = target.dataset.productName || 'Món ăn';
          const reason = prompt(`Báo hết món đột xuất & hủy món "${prodName}" khỏi Đơn #${orderId}?\nNhập lý do báo hủy (Món sẽ tự động chuyển sang Tạm ngưng trên Menu và ghi Log ca thu ngân):`, 'Hết nguyên liệu đột xuất tại Bếp');
          if (reason !== null) {
            const res = await api(`/api/orders/${orderId}/items/${itemId}/cancel`, {
              method: 'PUT',
              body: JSON.stringify({ reason, markSoldOut: true })
            });
            toast('success', 'Đã hủy món tại Bếp', res.message || `Đã hủy món ${prodName} khỏi Đơn #${orderId}`);
            await reloadAfterMutation();
          }
          break;
        }
        case 'add-order-item':
          addOrderItem();
          break;
        case 'remove-order-item':
          removeOrderItem(target.closest('.item-row'));
          break;
        case 'toggle-view-mode':
          state.viewModes[view] = target.dataset.mode || 'grid';
          render();
          break;
        case 'set-filter-tab':
          state.activeTabs[view] = target.dataset.tab || 'ALL';
          render();
          break;
        case 'toggle-product-available': {
          const product = (state.data.products || []).find(p => String(p.id) === String(id));
          if (product) {
            await simpleAction(`/api/products/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ ...product, isAvailable: !product.isAvailable })
            }, product.isAvailable ? 'Đã ngưng bán món ăn' : 'Đã bật bán món ăn');
          }
          break;
        }
        case 'toggle-user-status': {
          const userObj = (state.data.users || []).find(u => String(u.id) === String(id));
          if (userObj) {
            const newStatus = String(userObj.status).toUpperCase() === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
            await simpleAction(`/api/users/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ ...userObj, status: newStatus })
            }, newStatus === 'BLOCKED' ? 'Đã khóa tài khoản người dùng' : 'Đã mở khóa tài khoản');
          }
          break;
        }
        case 'view-user-detail': {
          const userObj = (state.data.users || []).find(u => String(u.id) === String(id));
          if (userObj) {
            state.modal = { kind: 'user-detail', record: userObj };
            render();
          }
          break;
        }
        case 'toggle-order-detail': {
          const detailRow = app.querySelector(`[data-order-detail="${id}"]`);
          if (detailRow) {
            detailRow.classList.toggle('hidden');
          }
          break;
        }
        case 'confirm-order': {
          await simpleAction(`/api/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'CONFIRMED' })
          }, `Đã xác nhận Đơn hàng #${id} và chuyển qua Bếp chế biến!`);
          break;
        }
        case 'cancel-order': {
          if (confirm(`Bạn chắc chắn muốn HỦY bỏ Đơn hàng #${id}?`)) {
            await simpleAction(`/api/orders/${id}/status`, {
              method: 'PUT',
              body: JSON.stringify({ status: 'CANCELLED' })
            }, `Đã hủy bỏ Đơn hàng #${id}.`);
          }
          break;
        }
        case 'open-admin-checkout': {
          const tableNumber = target.dataset.table;
          const customerName = target.dataset.customer;
          const amount = target.dataset.amount;
          const itemsCount = target.dataset.items;
          const status = target.dataset.status;
          openAdminCheckoutModal(id, tableNumber, customerName, amount, itemsCount, status);
          break;
        }
        case 'open-table-qr-modal': {
          const number = target.dataset.number;
          const capacity = target.dataset.capacity || 4;
          const code = target.dataset.code || `T${number}`;
          const url = target.dataset.url;
          const img = target.dataset.img;
          state.modal = {
            kind: 'table-qr',
            record: { number, capacity, code, url, img }
          };
          render();
          break;
        }
        case 'toggle-table-detail': {
          const detailRow = app.querySelector(`[data-table-detail="${id}"]`);
          if (detailRow) {
            detailRow.classList.toggle('hidden');
          }
          break;
        }
        case 'copy-table-url': {
          const url = target.dataset.url;
          if (url) {
            if (navigator?.clipboard?.writeText) {
              navigator.clipboard.writeText(url).then(() => {
                toast('success', 'Đã sao chép liên kết', 'Đường dẫn gọi món bàn đã được sao chép.');
              }).catch(() => {
                prompt('Sao chép liên kết gọi món bàn:', url);
              });
            } else {
              prompt('Sao chép liên kết gọi món bàn:', url);
            }
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      toast('danger', 'Thao tác thất bại', error.message || 'Không thể thực hiện thao tác.');
    }
  };

  app.onchange = async event => {
    const target = event.target;
    if (target.matches('[data-action="table-status-select"]')) {
      const id = target.dataset.id;
      const status = target.value;
      try {
        await simpleAction(`/api/tables/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status })
        }, 'Đã cập nhật trạng thái bàn');
      } catch (err) {
        toast('danger', 'Cập nhật thất bại', err.message || 'Không thể đổi trạng thái bàn.');
      }
    } else if (target.matches('[data-action="pos-order-table-change"]')) {
      const tableId = target.value;
      const tableObj = (state.data.tables || []).find(t => String(t.id) === String(tableId));
      const activeTableOrder = tableId ? (state.data.orders || []).find(o =>
        String(o.table_id) === String(tableId) &&
        String(o.paymentStatus).toUpperCase() !== 'PAID' &&
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(String(o.status).toUpperCase())
      ) : null;

      const bannerEl = app.querySelector('#posTableActiveOrderBanner');
      if (bannerEl) {
        if (activeTableOrder) {
          bannerEl.style.display = 'block';
          bannerEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> <strong>Bàn này đang có Đơn #${activeTableOrder.id} (${activeTableOrder.status} • ${formatCurrency(activeTableOrder.finalPrice ?? activeTableOrder.totalPrice)})</strong> — Món mới và thông tin Thành viên/Vãng lai bạn chọn bên dưới sẽ được <strong>gộp trực tiếp vào Đơn #${activeTableOrder.id}</strong> (không bị tạo đơn chồng)!`;
        } else {
          bannerEl.style.display = 'none';
        }
      }

      const resv = tableObj?.activeReservation || (state.data.reservations || []).find(r =>
        String(r.table_id) === String(tableId) &&
        ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED'].includes(String(r.status).toUpperCase())
      );

      const matchedUserId = resv?.user_id || activeTableOrder?.user_id || '';
      const matchedUser = matchedUserId ? (state.data.users || []).find(u => String(u.id) === String(matchedUserId)) : null;
      const selectEl = app.querySelector('#orderCustomerSelect');
      const phoneEl = app.querySelector('#orderCustomerPhone');
      const searchEl = app.querySelector('#posMemberSearchInput');
      const infoCard = app.querySelector('#posSelectedMemberInfoCard');

      if (matchedUser) {
        if (selectEl) selectEl.value = String(matchedUser.id);
        if (phoneEl) phoneEl.value = matchedUser.phone || '';
        if (searchEl) searchEl.value = `${matchedUser.fullName || matchedUser.username} (${matchedUser.phone || ''})`;
        if (infoCard) {
          infoCard.innerHTML = `
            <div style="padding:0.65rem 0.9rem; border-radius:12px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; font-size:0.84rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem">
              <div><strong>⭐ Đã đồng bộ Thành viên từ Bàn: ${escapeHtml(matchedUser.fullName || matchedUser.username)}</strong> • SĐT: <strong>${escapeHtml(matchedUser.phone || '-')}</strong></div>
              <div>Hạng thẻ: <span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800">${escapeHtml(matchedUser.tier || 'MEMBER')}</span> • Điểm khả dụng: <strong>${formatNumber(matchedUser.points || 0)} điểm</strong></div>
            </div>
          `;
        }
      } else if (resv) {
        if (selectEl) selectEl.value = '';
        if (phoneEl) phoneEl.value = resv.guestPhone || '';
        if (searchEl) searchEl.value = '';
      }
    } else if (target.matches('[data-action="pos-customer-select-change"]')) {
      const userId = target.value;
      const userObj = userId ? (state.data.users || []).find(u => String(u.id) === String(userId)) : null;
      const phoneEl = app.querySelector('#orderCustomerPhone');
      const searchEl = app.querySelector('#posMemberSearchInput');
      const pointsEl = app.querySelector('#orderPoints');
      const infoCard = app.querySelector('#posSelectedMemberInfoCard');

      if (userObj) {
        if (phoneEl) phoneEl.value = userObj.phone || '';
        if (searchEl) searchEl.value = `${userObj.fullName || userObj.username} (${userObj.phone || ''})`;
        if (pointsEl) pointsEl.max = String(Number(userObj.points || 0));
        if (infoCard) {
          infoCard.innerHTML = `
            <div style="padding:0.65rem 0.9rem; border-radius:12px; background:#f0fdf4; border:1px solid #bbf7d0; color:#166534; font-size:0.84rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem">
              <div><strong>⭐ Đã chọn Thành viên: ${escapeHtml(userObj.fullName || userObj.username)}</strong> • SĐT: <strong>${escapeHtml(userObj.phone || '-')}</strong></div>
              <div>Hạng thẻ: <span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800">${escapeHtml(userObj.tier || 'MEMBER')}</span> • Điểm khả dụng: <strong>${formatNumber(userObj.points || 0)} điểm</strong></div>
            </div>
          `;
        }
      } else {
        if (phoneEl) phoneEl.value = '';
        if (searchEl) searchEl.value = '';
        if (infoCard) {
          infoCard.innerHTML = `
            <div style="padding:0.55rem 0.9rem; border-radius:12px; background:#f8fafc; border:1px solid #e2e8f0; color:#64748b; font-size:0.82rem">
              👤 Đang chọn: <strong>Khách vãng lai</strong> (Gõ Tên hoặc SĐT vào ô Tìm kiếm bên trên để chọn Thành viên tích điểm)
            </div>
          `;
        }
      }
    }
  };

  app.oninput = event => {
    const target = event.target;
    if (target.matches('[data-action="search-input"]')) {
      state.filters[target.dataset.view] = target.value;
      render();
    } else if (target.matches('[data-action="pos-member-search"]')) {
      const rawKeyword = String(target.value || '').trim().toLowerCase();
      const normKeyword = rawKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const users = Array.isArray(state.data.users) ? state.data.users : [];
      const suggestBox = app.querySelector('#posMemberSuggestList');

      if (!suggestBox) return;
      if (!rawKeyword) {
        suggestBox.style.display = 'none';
        return;
      }

      const matchedUsers = users.filter(u => {
        const haystack = `${u.fullName || ''} ${u.phone || ''} ${u.username || ''} ${u.email || ''} ${u.tier || ''}`.toLowerCase();
        const normHaystack = haystack.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return haystack.includes(rawKeyword) || normHaystack.includes(normKeyword);
      });

      suggestBox.style.display = 'grid';
      suggestBox.style.gap = '0.3rem';
      suggestBox.innerHTML = `
        <button type="button" data-action="select-pos-member-suggest" data-user-id="" style="text-align:left; padding:0.5rem 0.7rem; border-radius:8px; border:1px solid #e2e8f0; background:#f8fafc; color:#475569; font-size:0.82rem; cursor:pointer; font-weight:700">
          👤 Chọn Khách vãng lai (Không gắn tài khoản thành viên)
        </button>
        ${matchedUsers.length ? matchedUsers.map(u => `
          <button type="button" data-action="select-pos-member-suggest" data-user-id="${u.id}" style="text-align:left; padding:0.55rem 0.75rem; border-radius:8px; border:1px solid #dbeafe; background:#eff6ff; color:#0f172a; font-size:0.83rem; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:0.5rem">
            <div>
              <strong>⭐ ${escapeHtml(u.fullName || u.username)}</strong>
              <span style="color:#004ac6; font-weight:700; margin-left:0.35rem">📞 ${escapeHtml(u.phone || 'Chưa có SĐT')}</span>
            </div>
            <span class="badge-inline" style="background:#fef3c7; color:#b45309; font-weight:800; font-size:0.75rem">
              Hạng ${escapeHtml(u.tier || 'MEMBER')} • ${formatNumber(u.points || 0)} điểm
            </span>
          </button>
        `).join('') : `<div style="padding:0.6rem; color:#64748b; font-size:0.82rem; text-align:center">Không tìm thấy thành viên nào khớp với "${escapeHtml(target.value)}"</div>`}
      `;
    }
  };

  app.onsubmit = async event => {
    const form = event.target;
    const formName = form.dataset.form;
    if (!formName) return;
    event.preventDefault();

    try {
      if (formName === 'entity') {
        await submitEntityForm(form);
      } else if (formName === 'order-create') {
        await submitOrderForm(form);
      } else if (formName === 'reservation-create') {
        await submitReservationForm(form);
      } else if (formName === 'table-bulk-create') {
        await submitTableBulkForm(form);
      } else if (formName === 'stats-filter') {
        const formData = new FormData(form);
        state.statsQuery = {
          type: String(formData.get('type') || 'day'),
          date: String(formData.get('date') || '')
        };
        state.loading = true;
        render();
        await loadAllData();
        state.loading = false;
        render();
      } else if (formName === 'erp-barcode-import') {
        const payload = Object.fromEntries(new FormData(form));
        const res = await api('/api/ops/inventory/import-barcode', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast('success', 'Nhập kho thành công', res.message || 'Đã nhập lô hàng mới vào kho.');
        form.reset();
        await reloadAfterMutation();
      } else if (formName === 'erp-recipe-save') {
        const payload = Object.fromEntries(new FormData(form));
        const res = await api('/api/ops/recipes', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast('success', 'Đã lưu công thức', res.message || 'Đã cập nhật định lượng Recipe.');
        form.reset();
        await reloadAfterMutation();
      } else if (formName === 'erp-voucher-create') {
        const payload = Object.fromEntries(new FormData(form));
        await api('/api/ops/vouchers', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast('success', 'Đã tạo Voucher', `Mã giảm giá ${payload.code} đã sẵn sàng sử dụng.`);
        form.reset();
        await reloadAfterMutation();
      } else if (formName === 'erp-shift-open') {
        const payload = Object.fromEntries(new FormData(form));
        const res = await api('/api/ops/shifts/open', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast('success', 'Mở ca thành công', res.message || 'Đã mở ca thu ngân.');
        form.reset();
        await reloadAfterMutation();
      } else if (formName === 'erp-shift-close') {
        const payload = Object.fromEntries(new FormData(form));
        const res = await api('/api/ops/shifts/close', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast('success', 'Đã đóng ca & đối soát', `${res.message} • Chênh lệch: ${formatCurrency(res.data?.discrepancy || 0)}`);
        form.reset();
        await reloadAfterMutation();
      } else if (formName === 'erp-void-waste') {
        const f = Object.fromEntries(new FormData(form));
        const res = await api(`/api/ops/orders/${f.orderId}/void-waste`, {
          method: 'POST',
          body: JSON.stringify({
            managerPin: f.managerPin,
            reason: f.reason,
            isWaste: f.isWaste === 'true'
          })
        });
        toast('success', 'Đã duyệt hủy / hao hụt', res.message || 'Thao tác thành công.');
        form.reset();
        await reloadAfterMutation();
      }
    } catch (error) {
      toast('danger', 'Lưu thất bại', error.message || 'Không thể lưu dữ liệu.');
    }
  };
}

function openCreateModal(view) {
  const config = ENTITY_CONFIGS[view];
  if (config.customCreateMode === 'order') {
    state.modal = { kind: 'order-form' };
  } else if (config.customCreateMode === 'reservation') {
    state.modal = { kind: 'reservation-form' };
  } else if (config.customCreateMode === 'bulk-tables') {
    state.modal = { kind: 'bulk-tables' };
  } else {
    state.modal = {
      kind: 'generic-form',
      view,
      mode: 'create',
      title: config.createLabel,
      subtitle: `Tạo mới dữ liệu cho mục ${VIEW_META[view].title}.`,
      record: null
    };
  }
  render();
}

function openEditModal(view, id) {
  const config = ENTITY_CONFIGS[view];
  const record = (state.data[view] || []).find(item => String(item.id) === String(id));
  if (!record) {
    toast('danger', 'Không tìm thấy bản ghi', 'Bản ghi cần chỉnh sửa không tồn tại.');
    return;
  }

  state.modal = {
    kind: 'generic-form',
    view,
    mode: 'edit',
    title: `Sửa ${VIEW_META[view].title.toLowerCase()}`,
    subtitle: `Cập nhật trực tiếp bản ghi #${record.id}.`,
    record
  };
  render();
}

async function submitEntityForm(form) {
  const view = form.dataset.view;
  const mode = form.dataset.mode;
  const id = form.dataset.id;
  const config = ENTITY_CONFIGS[view];
  const payload = buildPayloadFromForm(form, config.fields, config.payload ? config.payload((mode === 'edit' ? state.data[view].find(item => String(item.id) === String(id)) : null) || {}) : {});
  const filePayload = await hydrateImageFields(form, config.fields, payload);
  const body = normalizePayload(view, filePayload, mode, id);

  const endpoint = mode === 'edit' ? `${config.endpoint}/${id}` : config.endpoint;
  const method = mode === 'edit' ? 'PUT' : 'POST';
  await api(endpoint, { method, body: JSON.stringify(body) });
  toast('success', 'Đã lưu dữ liệu', `${VIEW_META[view].title} đã được cập nhật.`);
  state.modal = null;
  await reloadAfterMutation();
}

function buildPayloadFromForm(form, fields, defaults = {}) {
  const formData = new FormData(form);
  const payload = { ...defaults };

  for (const field of fields) {
    if (field.type === 'image') {
      const textValue = String(formData.get(field.name) || '').trim();
      payload[field.name] = textValue;
      continue;
    }

    if (field.type === 'checkbox') {
      payload[field.name] = formData.has(field.name);
      continue;
    }

    if (field.type === 'select') {
      const raw = formData.get(field.name);
      payload[field.name] = raw === '' || raw === null ? '' : raw;
      continue;
    }

    const rawValue = formData.get(field.name);
    if (rawValue === null || rawValue === '') {
      if (field.requiredOnCreate) {
        continue;
      }
      payload[field.name] = defaults[field.name] ?? '';
      continue;
    }

    if (field.type === 'number') {
      payload[field.name] = Number(rawValue);
    } else {
      payload[field.name] = String(rawValue);
    }
  }

  return payload;
}

async function hydrateImageFields(form, fields, payload) {
  const nextPayload = { ...payload };
  const formData = new FormData(form);
  for (const field of fields.filter(item => item.type === 'image')) {
    const file = formData.get(`${field.name}File`);
    if (file instanceof File && file.size > 0) {
      nextPayload[field.name] = await uploadImage(file);
    }
  }
  return nextPayload;
}

function normalizePayload(view, payload, mode, id) {
  const body = { ...payload };

  if (view === 'users') {
    if (mode === 'edit' && !body.password) {
      delete body.password;
    }
    if (body.points !== undefined) {
      body.points = Number(body.points || 0);
    }
  }

  if (view === 'products') {
    body.price = Number(body.price || 0);
    body.costPrice = Number(body.costPrice || Math.round(Number(body.price || 0) * 0.38));
    body.stock = Number(body.stock || 0);
    body.category_id = Number(body.category_id || 0);
    body.isAvailable = Boolean(body.isAvailable);
    body.isSecretMenu = Boolean(body.isSecretMenu);
  }

  if (view === 'categories') {
    body.name = String(body.name || '').trim();
  }

  if (view === 'reservations') {
    body.numberOfGuests = Number(body.numberOfGuests || 1);
    if (body.user_id === '') delete body.user_id;
  }

  if (view === 'orders') {
    body.table_id = body.table_id ? Number(body.table_id) : null;
    body.used_points = Number(body.used_points || 0);
  }

  if (view === 'tables') {
    body.tableNumber = Number(body.tableNumber || 1);
    body.capacity = Number(body.capacity || 4);
    body.status = String(body.status || 'AVAILABLE');
    if (!body.qrCode) {
      body.qrCode = `T${body.tableNumber}`;
    }
  }

  return body;
}

function submitOrderForm(form) {
  const formData = new FormData(form);
  const itemRows = [...form.querySelectorAll('[data-order-item]')];
  const items = itemRows.map(row => {
    const productId = row.querySelector('[name="product_id"]')?.value;
    const quantity = Number(row.querySelector('[name="quantity"]')?.value || 1);
    const note = row.querySelector('[name="note"]')?.value || '';
    return {
      product_id: Number(productId),
      quantity,
      note
    };
  }).filter(item => item.product_id);

  if (!items.length) {
    throw new Error('Đơn hàng phải có ít nhất một món.');
  }

  const selectedUserId = formData.get('user_id') ? Number(formData.get('user_id')) : null;
  const customerPhone = String(formData.get('customerPhone') || '').trim();
  const voucherCode = String(formData.get('voucherCode') || '').trim().toUpperCase();
  const isMember = Boolean(selectedUserId || customerPhone);

  const body = {
    table_id: formData.get('table_id') ? Number(formData.get('table_id')) : null,
    customerType: isMember ? 'MEMBER' : 'GUEST',
    user_id: selectedUserId,
    customerPhone: customerPhone || null,
    voucherCode: voucherCode || null,
    items,
    note: String(formData.get('note') || ''),
    used_points: Number(formData.get('used_points') || 0)
  };

  return api('/api/orders', {
    method: 'POST',
    body: JSON.stringify(body)
  }).then(() => {
    toast('success', 'Đã tạo đơn hàng', 'Đơn hàng mới đã được gửi tới backend.');
    state.modal = null;
    return reloadAfterMutation();
  });
}

function submitReservationForm(form) {
  const formData = new FormData(form);
  const body = {
    guestName: String(formData.get('guestName') || ''),
    guestPhone: String(formData.get('guestPhone') || ''),
    reservationTime: String(formData.get('reservationTime') || ''),
    numberOfGuests: Number(formData.get('numberOfGuests') || 1),
    note: String(formData.get('note') || '')
  };

  const userId = formData.get('user_id');
  if (userId) {
    body.user_id = Number(userId);
  }

  return api('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(body)
  }).then(() => {
    toast('success', 'Đã tạo đặt bàn', 'Lịch đặt mới đã được lưu thành công.');
    state.modal = null;
    return reloadAfterMutation();
  });
}

function submitTableBulkForm(form) {
  const formData = new FormData(form);
  const raw = String(formData.get('tableBulkJson') || '');
  const tables = safeParseJson(raw);
  if (!Array.isArray(tables)) {
    throw new Error('JSON phải là một mảng các bàn.');
  }

  return api('/api/tables/bulk', {
    method: 'POST',
    body: JSON.stringify(tables)
  }).then(() => {
    toast('success', 'Đã nạp bàn', 'Danh sách bàn đã được đồng bộ vào backend.');
    state.modal = null;
    return reloadAfterMutation();
  });
}

function addOrderItem() {
  const list = app.querySelector('[data-order-items]');
  if (!list) return;
  const index = list.querySelectorAll('[data-order-item]').length;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderOrderItemRow(index, { product_id: state.data.products?.[0]?.id || '', quantity: 1, note: '' });
  list.appendChild(wrapper.firstElementChild);
}

function removeOrderItem(row) {
  if (!row) return;
  const list = row.parentElement;
  if (!list || list.querySelectorAll('[data-order-item]').length <= 1) {
    toast('warning', 'Không thể xóa hết món', 'Đơn hàng cần ít nhất một món.');
    return;
  }
  row.remove();
}

async function deleteRecord(view, id) {
  const message = view === 'reviews'
    ? 'Bạn chắc chắn muốn xóa đánh giá này?'
    : `Bạn chắc chắn muốn xóa ${VIEW_META[view].title.toLowerCase()} #${id}?`;

  if (!window.confirm(message)) return;

  const config = ENTITY_CONFIGS[view];
  if (view === 'reviews') {
    await api(`/api/reviews/${id}`, { method: 'DELETE' });
  } else {
    await api(`${config.endpoint}/${id}`, { method: 'DELETE' });
  }

  toast('success', 'Đã xóa bản ghi', `${VIEW_META[view].title} đã được xóa thành công.`);
  await reloadAfterMutation();
}

async function simpleAction(path, options, successMessage) {
  await api(path, options);
  toast('success', 'Hoàn tất', successMessage);
  await reloadAfterMutation();
}

async function reloadAfterMutation() {
  state.loading = true;
  render();
  await loadAllData();
  state.loading = false;
  render();
}

function openAdminCheckoutModal(orderId, tableNumber, customerName, amount, itemsCount, status) {
  const st = String(status || '').toUpperCase();
  if (st && st !== 'READY' && st !== 'COMPLETED') {
    toast('amber', 'Chưa thể thanh toán', `Đơn hàng #${orderId} chưa hoàn thành chế biến! (Trạng thái: ${st}). Vui lòng chờ Bếp nấu xong (READY) trước khi thanh toán.`);
    return;
  }

  state.checkoutOrderId = orderId;
  state.checkoutAmount = Number(amount || 0);

  const tableText = tableNumber ? `Bàn #${tableNumber}` : 'Mang đi / Chưa gán bàn';

  if (document.querySelector('#payment-modal-title')) document.querySelector('#payment-modal-title').textContent = `💳 Thanh toán Đơn hàng #${orderId}`;
  if (document.querySelector('#payment-modal-sub')) document.querySelector('#payment-modal-sub').textContent = `Vị trí: ${tableText} • Khách hàng: ${customerName}`;
  if (document.querySelector('#payment-modal-amount')) document.querySelector('#payment-modal-amount').textContent = formatCurrency(amount);
  if (document.querySelector('#payment-modal-items-count')) document.querySelector('#payment-modal-items-count').textContent = `${itemsCount || 0} món ăn trong đơn hàng`;

  if (document.querySelector('#cash-given-input')) document.querySelector('#cash-given-input').value = '';
  if (document.querySelector('#cash-change-text')) document.querySelector('#cash-change-text').textContent = '0 ₫';

  switchAdminPaymentTab('cash');

  const modalEl = document.querySelector('#staff-payment-modal');
  if (modalEl) modalEl.classList.remove('hidden');
}

function switchAdminPaymentTab(tab) {
  state.paymentTab = tab;
  const cashBtn = document.querySelector('#tab-pay-cash');
  const payosBtn = document.querySelector('#tab-pay-payos');
  const cashPanel = document.querySelector('#panel-pay-cash');
  const payosPanel = document.querySelector('#panel-pay-payos');

  if (tab === 'cash') {
    if (cashBtn) cashBtn.className = 'btn btn-primary';
    if (payosBtn) payosBtn.className = 'btn btn-secondary';
    if (cashPanel) cashPanel.classList.remove('hidden');
    if (payosPanel) payosPanel.classList.add('hidden');
  } else {
    if (cashBtn) cashBtn.className = 'btn btn-secondary';
    if (payosBtn) payosBtn.className = 'btn btn-primary';
    if (cashPanel) cashPanel.classList.add('hidden');
    if (payosPanel) payosPanel.classList.remove('hidden');

    initAdminPayOSCheckout(state.checkoutOrderId);
  }
}

async function initAdminPayOSCheckout(orderId) {
  if (!orderId) return;
  const qrImg = document.querySelector('#payos-qr-image');
  const statusTxt = document.querySelector('#payos-qr-status');
  const codeTxt = document.querySelector('#payos-order-code');
  const webBtn = document.querySelector('#btn-open-payos-url');

  if (statusTxt) statusTxt.textContent = '⏳ Đang kết nối liên kết thanh toán PayOS Backend...';

  const payosData = await generatePayOSQRUrl(orderId, state.checkoutAmount);
  if (qrImg) qrImg.src = payosData.qrUrl;
  if (statusTxt) statusTxt.textContent = `🟢 Mã QR PayOS đã sẵn sàng (Số HĐ: ${payosData.orderCode})`;
  if (codeTxt) codeTxt.textContent = `PAYOS-CODE: ${payosData.orderCode}`;
  if (webBtn && payosData.checkoutUrl) {
    webBtn.href = payosData.checkoutUrl;
    webBtn.style.display = 'inline-flex';
  }
}

// Global Document Handlers for Admin Payment Modal
document.addEventListener('click', async event => {
  if (event.target.closest('#close-staff-payment-modal')) {
    const modalEl = document.querySelector('#staff-payment-modal');
    if (modalEl) modalEl.classList.add('hidden');
    return;
  }

  if (event.target.closest('#tab-pay-cash')) {
    switchAdminPaymentTab('cash');
    return;
  }
  if (event.target.closest('#tab-pay-payos')) {
    switchAdminPaymentTab('payos');
    return;
  }

  if (event.target.closest('#btn-confirm-cash-paid')) {
    if (!state.checkoutOrderId) return;
    try {
      await api(`/api/orders/${state.checkoutOrderId}/pay`, {
        method: 'PUT',
        body: JSON.stringify({ paymentMethod: 'CASH' })
      });
      toast('success', 'Thanh toán thành công', `Đơn hàng #${state.checkoutOrderId} đã được thu tiền mặt.`);
      const modalEl = document.querySelector('#staff-payment-modal');
      if (modalEl) modalEl.classList.add('hidden');
      await reloadAfterMutation();
    } catch (err) {
      toast('danger', 'Lỗi thanh toán', err.message || 'Không thể thanh toán tiền mặt');
    }
    return;
  }

  if (event.target.closest('#btn-confirm-transfer-paid')) {
    if (!state.checkoutOrderId) return;
    try {
      await api(`/api/orders/${state.checkoutOrderId}/pay`, {
        method: 'PUT',
        body: JSON.stringify({ paymentMethod: 'TRANSFER' })
      });
      toast('success', 'Thanh toán thành công', `Đơn hàng #${state.checkoutOrderId} đã được xác nhận chuyển khoản.`);
      const modalEl = document.querySelector('#staff-payment-modal');
      if (modalEl) modalEl.classList.add('hidden');
      await reloadAfterMutation();
    } catch (err) {
      toast('danger', 'Lỗi thanh toán', err.message || 'Không thể thanh toán chuyển khoản');
    }
    return;
  }

  if (event.target.closest('#btn-check-payos-status')) {
    if (!state.checkoutOrderId) return;
    try {
      const res = await api(`/api/payos/check-status/${state.checkoutOrderId}`);
      if (res.status === 'PAID') {
        toast('success', 'PayOS Thành công', `Đơn hàng #${state.checkoutOrderId} đã được thanh toán qua PayOS!`);
        const modalEl = document.querySelector('#staff-payment-modal');
        if (modalEl) modalEl.classList.add('hidden');
        await reloadAfterMutation();
      } else {
        toast('warning', 'Chưa thanh toán', `Trạng thái PayOS: ${res.payosStatus || res.status}`);
      }
    } catch (err) {
      toast('danger', 'Lỗi kiểm tra', err.message || 'Không thể kiểm tra PayOS');
    }
    return;
  }
});

document.addEventListener('input', event => {
  if (event.target.id === 'cash-given-input') {
    const given = Number(event.target.value || 0);
    const amount = Number(state.checkoutAmount || 0);
    const change = Math.max(0, given - amount);
    const changeEl = document.querySelector('#cash-change-text');
    if (changeEl) {
      changeEl.textContent = formatCurrency(change);
      changeEl.style.color = given >= amount && amount > 0 ? '#15803d' : '#dc2626';
    }
  }
});

const initialViewParam = new URLSearchParams(window.location.search).get('view');
if (initialViewParam && VIEW_META[initialViewParam]) {
  state.activeView = initialViewParam;
}
render();
boot();
