/*==================================================
                VERIFY TABLE QR / TABLE PARAM
==================================================*/

async function verifyTableQr() {
    const params = new URLSearchParams(window.location.search);
    const qr =
        params.get("qr") ||
        params.get("table") ||
        params.get("tableId") ||
        sessionStorage.getItem("appdatmon_table_qr") ||
        "1";

    try {
        const table = await api(`/api/tables/qr/${encodeURIComponent(qr)}`);
        if (!table) {
            throw new Error("Mã QR không hợp lệ.");
        }
        sessionStorage.setItem("appdatmon_table_qr", String(table.qrCode || qr));
        sessionStorage.setItem("appdatmon_table", JSON.stringify(table));
        return true;
    } catch (error) {
        console.warn("QR lookup fallback to first table:", error);
        try {
            const allTables = await api("/api/tables");
            if (Array.isArray(allTables) && allTables.length > 0) {
                const first = allTables[0];
                sessionStorage.setItem("appdatmon_table_qr", String(first.qrCode || first.tableNumber || "1"));
                sessionStorage.setItem("appdatmon_table", JSON.stringify(first));
                return true;
            }
        } catch (_) {}
        return true;
    }
}

/*==================================================
                    MENU STATE
==================================================*/

const productGrid = document.getElementById("productGrid");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

let products = [];
let categories = [];
let cart = [];
let availableVouchers = [];
let allTablesList = [];

let orderCustomerState = {
    customerType: "GUEST", // 'GUEST' | 'MEMBER'
    memberUser: null,      // { id, fullName, phone, points, tier }
    usedPoints: 0,
    voucherCode: "",
    discountPreview: null  // { tierDiscount, voucherDiscount, totalDiscount, finalPrice }
};

/*==================================================
                    INIT
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {
    if (!productGrid || !categorySelect || !searchInput || !cartItems || !totalPrice) {
        return;
    }

    await verifyTableQr();
    await Promise.all([
        loadCategories(),
        loadProducts(),
        loadAvailableVouchers(),
        loadAllTablesForMenu()
    ]);

    // Nếu khách đã đăng nhập tài khoản trên trình duyệt, tự động nạp thông tin thành viên
    try {
        const rawUser = localStorage.getItem("appdatmon_customer_user") || localStorage.getItem("appdatmon_user");
        const savedUser = JSON.parse(rawUser || "null");
        if (savedUser && (savedUser.phone || savedUser.id)) {
            orderCustomerState.customerType = "MEMBER";
            orderCustomerState.memberUser = savedUser;
        }
    } catch (_) {}

    mountGuestOrderControls();
    renderCart();

    searchInput.addEventListener("input", renderProducts);
    categorySelect.addEventListener("change", renderProducts);

    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }
});

async function loadAvailableVouchers() {
    try {
        const list = await api("/api/ops/vouchers");
        availableVouchers = Array.isArray(list) ? list.filter(v => v.isActive !== false) : [];
    } catch (_) {
        availableVouchers = [];
    }
}

async function loadAllTablesForMenu() {
    try {
        const list = await api("/api/tables");
        allTablesList = Array.isArray(list) ? list : [];
    } catch (_) {
        allTablesList = [];
    }
}

/*==================================================
                    CATEGORY & PRODUCT
==================================================*/

async function loadCategories() {
    try {
        categories = await api("/api/categories");
        categorySelect.innerHTML = `<option value="">Tất cả danh mục</option>`;
        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    } catch (error) {
        console.error("Load categories error:", error);
    }
}

async function loadProducts() {
    try {
        products = await api("/api/products?available=true");
        renderProducts();
    } catch (error) {
        console.error("Load products error:", error);
        showToast("Không tải được thực đơn.");
    }
}

function renderProducts() {
    const keyword = searchInput.value.toLowerCase().trim();
    const category = categorySelect.value;

    const list = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(keyword);
        const matchCategory = category === "" || String(product.category_id) === String(category);
        return matchName && matchCategory;
    });

    productGrid.innerHTML = "";
    if (list.length === 0) {
        productGrid.innerHTML = `<div class="empty" style="grid-column:1/-1">Không tìm thấy món ăn phù hợp.</div>`;
        return;
    }

    list.forEach(renderCard);
}

function getProductImage(product) {
    if (!product.image || product.image.trim() === "") {
        return "./assets/images/no-image.png";
    }
    if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
        return product.image;
    }
    if (product.image.startsWith("/")) {
        return `${window.location.origin}${product.image}`;
    }
    return `${window.location.origin}/uploads/${product.image}`;
}

function renderCard(product) {
    const imageUrl = getProductImage(product);
    const vipBadge = product.isSecretMenu
        ? `<span style="position:absolute; top:12px; right:12px; background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; font-size:11px; font-weight:800; padding:4px 10px; border-radius:99px; box-shadow:0 4px 10px rgba(0,0,0,0.3)">👑 VIP Secret</span>`
        : "";

    productGrid.innerHTML += `
        <div class="product-card">
            <div class="product-image" style="position:relative">
                ${vipBadge}
                <img
                    src="${imageUrl}"
                    alt="${product.name}"
                    onerror="this.onerror=null; this.src='./assets/images/no-image.png';"
                >
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description || "Hương vị Nhật Bản tươi ngon chuẩn FutureSushi."}</p>
                <div class="product-footer">
                    <div class="product-price">${Number(product.price).toLocaleString("vi-VN")}đ</div>
                    <button class="add-cart" onclick="addToCart(${product.id})" title="Thêm vào giỏ hàng">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/*==================================================
                    CART
==================================================*/

window.addToCart = function(id) {
    const product = products.find(p => Number(p.id) === Number(id));
    if (!product) return;

    const item = cart.find(i => Number(i.id) === Number(id));
    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    refreshDiscountAndRenderCart();
    showToast(`Đã thêm "${product.name}" vào giỏ hàng.`);
};

window.plus = function(id) {
    const item = cart.find(p => Number(p.id) === Number(id));
    if (!item) return;
    item.quantity++;
    refreshDiscountAndRenderCart();
};

window.minus = function(id) {
    const item = cart.find(p => Number(p.id) === Number(id));
    if (!item) return;
    item.quantity--;
    if (item.quantity <= 0) {
        cart = cart.filter(p => Number(p.id) !== Number(id));
    }
    refreshDiscountAndRenderCart();
};

function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + item.quantity * Number(item.price || 0), 0);
}

async function refreshDiscountAndRenderCart() {
    const subtotal = getCartSubtotal();
    if (subtotal > 0 && (orderCustomerState.voucherCode || (orderCustomerState.customerType === "MEMBER" && orderCustomerState.memberUser))) {
        try {
            const res = await api("/api/ops/discount/preview", {
                method: "POST",
                body: JSON.stringify({
                    subtotal,
                    voucherCode: orderCustomerState.voucherCode || undefined,
                    user_id: orderCustomerState.customerType === "MEMBER" ? orderCustomerState.memberUser?.id : undefined
                })
            });
            orderCustomerState.discountPreview = res;
        } catch (err) {
            orderCustomerState.discountPreview = null;
        }
    } else {
        orderCustomerState.discountPreview = null;
    }
    renderCart();
}

function renderCart() {
    if (!cartItems || !totalPrice) return;

    cartItems.innerHTML = "";
    const subtotal = getCartSubtotal();

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart">Chưa có món ăn nào trong giỏ.</div>`;
        totalPrice.innerHTML = "0đ";
        updatePricingBreakdownUI(0, 0, 0);
        return;
    }

    cart.forEach(item => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-info">
                    <h4>${item.name}</h4>
                    <span>${Number(item.price).toLocaleString("vi-VN")}đ x ${item.quantity}</span>
                </div>
                <div class="quantity">
                    <button type="button" onclick="minus(${item.id})">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="plus(${item.id})">+</button>
                </div>
            </div>
        `;
    });

    const tierAndVoucherDisc = Number(orderCustomerState.discountPreview?.totalDiscount || 0);
    const maxPointsAllowed = orderCustomerState.customerType === "MEMBER" && orderCustomerState.memberUser
        ? Math.min(Number(orderCustomerState.memberUser.points || 0), Math.max(0, subtotal - tierAndVoucherDisc))
        : 0;
    const pointsDisc = Math.min(Number(orderCustomerState.usedPoints || 0), maxPointsAllowed);
    const totalDiscount = tierAndVoucherDisc + pointsDisc;
    const finalAmount = Math.max(0, subtotal - totalDiscount);

    totalPrice.innerHTML = finalAmount.toLocaleString("vi-VN") + "đ";
    updatePricingBreakdownUI(subtotal, totalDiscount, finalAmount);
}

function updatePricingBreakdownUI(subtotal, totalDiscount, finalAmount) {
    const box = document.getElementById("pricingBreakdownBox");
    if (!box) return;

    const isMember = orderCustomerState.customerType === "MEMBER" && orderCustomerState.memberUser;
    const estPoints = isMember && finalAmount > 0 ? Math.max(10, Math.round(finalAmount * 0.05)) : 0;

    box.innerHTML = `
        <div style="display:flex; justify-content:space-between; color:#cbd5e1; font-size:13px;">
            <span>Tạm tính (${cart.reduce((s, i) => s + i.quantity, 0)} món):</span>
            <strong>${subtotal.toLocaleString("vi-VN")}đ</strong>
        </div>
        ${totalDiscount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#4ade80; font-size:13px;">
                <span>Giảm giá (Hạng thẻ / Voucher / Điểm):</span>
                <strong>-${totalDiscount.toLocaleString("vi-VN")}đ</strong>
            </div>
        ` : ""}
        <div style="display:flex; justify-content:space-between; color:${isMember ? "#facc15" : "#94a3b8"}; font-size:12.5px;">
            <span>Điểm thưởng tích lũy:</span>
            <strong>${isMember ? `+${estPoints.toLocaleString("vi-VN")} điểm (Thành viên)` : "0 điểm (Khách vãng lai)"}</strong>
        </div>
    `;
}

/*==================================================
        CONTROLS: MEMBER / GUEST + VOUCHER + TABLE
==================================================*/

function mountGuestOrderControls() {
    const cartPanel = document.querySelector(".cart-panel");
    if (!cartPanel || document.getElementById("guestExtraControls")) return;

    const currentTable = JSON.parse(sessionStorage.getItem("appdatmon_table") || "null");
    const totalRow = cartPanel.querySelector(".cart-total");

    const extraDiv = document.createElement("div");
    extraDiv.id = "guestExtraControls";
    extraDiv.style.cssText = "margin-top:14px; display:grid; gap:10px; font-size:13px;";

    extraDiv.innerHTML = `
        <!-- 1. Chế độ ăn tại bàn & Chọn bàn -->
        <div style="display:grid; grid-template-columns:1fr 115px; gap:6px;">
            <select id="orderModeSelect" style="padding:9px; border-radius:10px; background:#27272a; color:#fff; border:1px solid #3f3f46; font-weight:600;">
                <option value="DINE_IN">🍽️ Ăn tại bàn (QR)</option>
                <option value="DELIVERY">🛵 Giao tận nơi</option>
            </select>
            <select id="menuTableSelect" style="padding:9px; border-radius:10px; background:#27272a; color:#38bdf8; border:1px solid #3f3f46; font-weight:700;" title="Bàn đang ngồi">
                ${allTablesList.map(t => `<option value="${t.id}" ${Number(t.id) === Number(currentTable?.id) ? "selected" : ""}>Bàn #${t.tableNumber}</option>`).join("") || `<option value="${currentTable?.id || 1}">Bàn #${currentTable?.tableNumber || 1}</option>`}
            </select>
        </div>

        <!-- 2. Chọn Khách Vãng Lai hoặc Thành Viên Đã Đăng Ký để Tích Điểm -->
        <div style="background:#222226; padding:11px; border-radius:12px; border:1px solid #3f3f46; display:grid; gap:8px;">
            <div style="font-weight:700; color:#f4f4f5; font-size:12.5px; display:flex; justify-content:space-between; align-items:center;">
                <span><i class="fa-solid fa-user-check" style="color:#ff595e"></i> Đối tượng khách & Tích điểm</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                <button type="button" id="btnTypeGuest" style="padding:7px 8px; border-radius:8px; border:1px solid #ef4444; background:#ef4444; color:#fff; font-weight:700; font-size:12px; cursor:pointer;">
                    👤 Khách vãng lai
                </button>
                <button type="button" id="btnTypeMember" style="padding:7px 8px; border-radius:8px; border:1px solid #3f3f46; background:#18181b; color:#cbd5e1; font-weight:700; font-size:12px; cursor:pointer;">
                    ⭐ Thành viên (Tích điểm)
                </button>
            </div>

            <!-- Khung Tìm kiếm Thành viên theo Tên / SĐT / Username -->
            <div id="memberLookupPanel" style="display:none; gap:7px; margin-top:2px;">
                <div style="display:flex; gap:6px;">
                    <input id="memberPhoneInput" type="text" placeholder="🔍 Tìm Tên, SĐT hoặc Username thành viên..." style="flex:1; padding:8px 10px; border-radius:8px; background:#18181b; color:#fff; border:1px solid #52525b; font-size:12.5px;" autocomplete="off" />
                    <button type="button" id="btnLookupMember" style="padding:8px 12px; border-radius:8px; background:#2563eb; color:#fff; border:0; font-weight:700; cursor:pointer; font-size:12px;">Tìm</button>
                </div>
                <div id="memberSearchResultsList" style="display:none; max-height:150px; overflow-y:auto; background:#18181b; border:1px solid #3f3f46; border-radius:8px; padding:4px; gap:4px;"></div>
                <div style="display:flex; gap:4px; flex-wrap:wrap; font-size:11px; color:#94a3b8;">
                    <span>Chọn nhanh:</span>
                    <button type="button" class="quick-member-btn" data-phone="0901234567" style="background:#27272a; color:#fde047; border:1px solid #3f3f46; border-radius:6px; padding:2px 6px; cursor:pointer;">0901234567 (Vàng)</button>
                    <button type="button" class="quick-member-btn" data-phone="0909999999" style="background:#27272a; color:#38bdf8; border:1px solid #3f3f46; border-radius:6px; padding:2px 6px; cursor:pointer;">0909999999 (VIP)</button>
                </div>
                <div id="memberVerifiedBadge" style="font-size:12px; color:#94a3b8;">Chưa chọn tài khoản thành viên.</div>
                <div id="memberUsePointsWrap" style="display:none; align-items:center; justify-content:space-between; gap:6px; padding-top:4px; border-top:1px dashed #3f3f46;">
                    <span style="font-size:12px; color:#cbd5e1;">Dùng điểm thưởng (1đ = 1₫):</span>
                    <input id="memberUsePointsInput" type="number" min="0" step="1000" value="0" style="width:105px; padding:5px 8px; border-radius:7px; background:#18181b; color:#fde047; border:1px solid #52525b; font-weight:700; text-align:right;" />
                </div>
            </div>
        </div>

        <!-- 3. Chọn hoặc Nhập Mã Voucher Giảm Giá -->
        <div style="background:#222226; padding:11px; border-radius:12px; border:1px solid #3f3f46; display:grid; gap:7px;">
            <div style="font-weight:700; color:#f4f4f5; font-size:12.5px;">
                <i class="fa-solid fa-ticket" style="color:#f59e0b"></i> Mã giảm giá (Voucher)
            </div>
            <select id="voucherSelectDropdown" style="padding:8px; border-radius:8px; background:#18181b; color:#fde047; border:1px solid #3f3f46; font-size:12.5px; font-weight:600;">
                <option value="">-- Chọn nhanh Voucher khuyến mãi --</option>
                ${availableVouchers.map(v => `<option value="${v.code}">${v.code} — Giảm ${v.discountType === "PERCENT" ? v.discountValue + "%" : Number(v.discountValue).toLocaleString("vi-VN") + "đ"} (Đơn từ ${Number(v.minOrderValue || 0).toLocaleString("vi-VN")}đ)</option>`).join("")}
            </select>
            <div style="display:flex; gap:6px;">
                <input id="voucherInput" type="text" placeholder="Hoặc nhập mã Voucher..." style="flex:1; padding:8px 10px; border-radius:8px; background:#18181b; color:#fff; border:1px solid #3f3f46; font-size:12.5px;" />
                <button type="button" id="btnApplyVoucher" style="padding:8px 12px; border-radius:8px; background:#16a34a; color:#fff; border:0; font-weight:700; cursor:pointer; font-size:12px;">Áp mã</button>
            </div>
            <div id="voucherStatusText" style="font-size:11.5px; color:#94a3b8;"></div>
        </div>

        <!-- 4. Ghi chú món ăn -->
        <input id="orderNoteInput" type="text" placeholder="📝 Ghi chú đơn hàng (VD: ít cay, không hành...)" style="padding:9px 11px; border-radius:10px; background:#222226; color:#fff; border:1px solid #3f3f46;" />

        <!-- 5. Bảng chi tiết Tạm tính / Giảm giá / Điểm tích lũy -->
        <div id="pricingBreakdownBox" style="background:#222226; padding:10px 12px; border-radius:10px; border:1px solid #3f3f46; display:grid; gap:5px;"></div>
    `;

    if (totalRow) {
        cartPanel.insertBefore(extraDiv, totalRow);
    } else {
        cartPanel.appendChild(extraDiv);
    }

    // Hộp theo dõi đơn hàng trực tiếp tại bàn đặt ở dưới nút Đặt món
    const trackerDiv = document.createElement("div");
    trackerDiv.id = "guestLiveOrderBox";
    trackerDiv.style.cssText = "margin-top:14px; padding:12px; border-radius:12px; background:rgba(15,23,42,0.88); border:1px solid #334155; font-size:13px;";
    cartPanel.appendChild(trackerDiv);

    bindCustomerCartControls();

    if (orderCustomerState.customerType === "MEMBER" && orderCustomerState.memberUser) {
        setCustomerTypeUI("MEMBER");
        document.getElementById("memberPhoneInput").value = orderCustomerState.memberUser.phone || "";
        renderVerifiedMemberBadge(orderCustomerState.memberUser);
    }

    const activeTableId = Number(document.getElementById("menuTableSelect")?.value || currentTable?.id || 1);
    refreshGuestTableTracker(activeTableId);
    setInterval(() => {
        const tId = Number(document.getElementById("menuTableSelect")?.value || currentTable?.id || 1);
        refreshGuestTableTracker(tId);
    }, 6000);
}

function setCustomerTypeUI(type) {
    orderCustomerState.customerType = type;
    const btnGuest = document.getElementById("btnTypeGuest");
    const btnMember = document.getElementById("btnTypeMember");
    const panel = document.getElementById("memberLookupPanel");

    if (type === "MEMBER") {
        btnMember.style.background = "#ef4444";
        btnMember.style.borderColor = "#ef4444";
        btnMember.style.color = "#ffffff";
        btnGuest.style.background = "#18181b";
        btnGuest.style.borderColor = "#3f3f46";
        btnGuest.style.color = "#cbd5e1";
        panel.style.display = "grid";
    } else {
        btnGuest.style.background = "#ef4444";
        btnGuest.style.borderColor = "#ef4444";
        btnGuest.style.color = "#ffffff";
        btnMember.style.background = "#18181b";
        btnMember.style.borderColor = "#3f3f46";
        btnMember.style.color = "#cbd5e1";
        panel.style.display = "none";
        orderCustomerState.usedPoints = 0;
    }
    refreshDiscountAndRenderCart();
}

function renderVerifiedMemberBadge(member) {
    const badge = document.getElementById("memberVerifiedBadge");
    const ptsWrap = document.getElementById("memberUsePointsWrap");
    if (!badge) return;
    if (!member) {
        badge.innerHTML = `<span style="color:#f87171;">Không tìm thấy thành viên với SĐT này.</span>`;
        if (ptsWrap) ptsWrap.style.display = "none";
        return;
    }
    const tierRates = { MEMBER: "0%", SILVER: "3%", GOLD: "5%", VIP: "10%" };
    const tier = member.tier || "MEMBER";
    badge.innerHTML = `
        <div style="background:#14532d; color:#bbf7d0; padding:7px 9px; border-radius:8px; border:1px solid #22c55e;">
            <div><strong>✅ ${member.fullName}</strong> (${member.phone})</div>
            <div style="font-size:11.5px; margin-top:2px;">Hạng thẻ: <strong style="color:#fde047">${tier} (Ưu đãi -${tierRates[tier] || "0%"})</strong> • Điểm: <strong>${Number(member.points || 0).toLocaleString("vi-VN")} đ</strong></div>
        </div>
    `;
    if (ptsWrap) ptsWrap.style.display = "flex";
}

let memberSearchTimer = null;

async function searchMembersLive(keyword) {
    const listBox = document.getElementById("memberSearchResultsList");
    if (!listBox) return;
    try {
        const members = await api(`/api/ops/members/search?q=${encodeURIComponent(keyword || "")}`);
        if (!Array.isArray(members) || members.length === 0) {
            listBox.style.display = "block";
            listBox.innerHTML = `<div style="padding:6px 8px; color:#94a3b8; font-size:11.5px;">Không tìm thấy thành viên phù hợp.</div>`;
            return;
        }
        listBox.style.display = "grid";
        listBox.innerHTML = members.map(m => `
            <button type="button" class="member-search-option" data-member='${JSON.stringify(m).replace(/'/g, "&apos;")}' style="text-align:left; padding:6px 8px; border-radius:6px; background:#27272a; color:#f4f4f5; border:1px solid #3f3f46; cursor:pointer; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                <span><strong>${m.fullName || m.username}</strong> (${m.phone || "Chưa có SĐT"})</span>
                <span style="color:#fde047; font-weight:700; font-size:11px;">${m.tier || "MEMBER"} • ${Number(m.points || 0).toLocaleString("vi-VN")}đ</span>
            </button>
        `).join("");

        listBox.querySelectorAll(".member-search-option").forEach(btn => {
            btn.addEventListener("click", async () => {
                try {
                    const userObj = JSON.parse(btn.dataset.member);
                    orderCustomerState.memberUser = userObj;
                    const inputEl = document.getElementById("memberPhoneInput");
                    if (inputEl) inputEl.value = `${userObj.fullName} (${userObj.phone})`;
                    listBox.style.display = "none";
                    renderVerifiedMemberBadge(userObj);
                    showToast(`Đã chọn thành viên: ${userObj.fullName} (Hạng ${userObj.tier || "MEMBER"})`);
                    await refreshDiscountAndRenderCart();
                } catch (_) {}
            });
        });
    } catch (_) {
        listBox.style.display = "none";
    }
}

async function lookupMemberPhone(phoneStr) {
    const cleanPhone = String(phoneStr || "").trim();
    if (!cleanPhone) {
        await searchMembersLive("");
        return;
    }
    try {
        const user = await api(`/api/ops/members/lookup?phone=${encodeURIComponent(cleanPhone)}`);
        orderCustomerState.memberUser = user;
        const listBox = document.getElementById("memberSearchResultsList");
        if (listBox) listBox.style.display = "none";
        renderVerifiedMemberBadge(user);
        showToast(`Đã chọn thành viên: ${user.fullName} (Hạng ${user.tier || "MEMBER"})`);
        await refreshDiscountAndRenderCart();
    } catch (err) {
        orderCustomerState.memberUser = null;
        renderVerifiedMemberBadge(null);
        showToast(err.message || "Không tìm thấy thành viên");
        await refreshDiscountAndRenderCart();
    }
}

function bindCustomerCartControls() {
    document.getElementById("btnTypeGuest")?.addEventListener("click", () => setCustomerTypeUI("GUEST"));
    document.getElementById("btnTypeMember")?.addEventListener("click", () => {
        setCustomerTypeUI("MEMBER");
        searchMembersLive(document.getElementById("memberPhoneInput")?.value || "");
    });

    document.getElementById("memberPhoneInput")?.addEventListener("input", e => {
        clearTimeout(memberSearchTimer);
        const val = e.target.value.trim();
        memberSearchTimer = setTimeout(() => {
            searchMembersLive(val);
        }, 200);
    });

    document.getElementById("memberPhoneInput")?.addEventListener("focus", e => {
        searchMembersLive(e.target.value.trim());
    });

    document.getElementById("btnLookupMember")?.addEventListener("click", () => {
        const phone = document.getElementById("memberPhoneInput")?.value;
        lookupMemberPhone(phone);
    });

    document.querySelectorAll(".quick-member-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const p = btn.dataset.phone;
            const input = document.getElementById("memberPhoneInput");
            if (input) input.value = p;
            lookupMemberPhone(p);
        });
    });

    document.getElementById("memberUsePointsInput")?.addEventListener("input", e => {
        orderCustomerState.usedPoints = Math.max(0, parseInt(e.target.value || "0", 10));
        renderCart();
    });

    document.getElementById("voucherSelectDropdown")?.addEventListener("change", async e => {
        const code = e.target.value;
        const input = document.getElementById("voucherInput");
        if (input) input.value = code;
        orderCustomerState.voucherCode = code;
        await applyVoucherPreview(code);
    });

    document.getElementById("btnApplyVoucher")?.addEventListener("click", async () => {
        const code = document.getElementById("voucherInput")?.value?.trim().toUpperCase() || "";
        orderCustomerState.voucherCode = code;
        await applyVoucherPreview(code);
    });

    document.getElementById("menuTableSelect")?.addEventListener("change", e => {
        const tableId = Number(e.target.value);
        const found = allTablesList.find(t => Number(t.id) === tableId);
        if (found) {
            sessionStorage.setItem("appdatmon_table", JSON.stringify(found));
            sessionStorage.setItem("appdatmon_table_qr", String(found.qrCode || found.tableNumber));
            refreshGuestTableTracker(found.id);
        }
    });
}

async function applyVoucherPreview(code) {
    const statusEl = document.getElementById("voucherStatusText");
    if (!code) {
        orderCustomerState.voucherCode = "";
        if (statusEl) statusEl.innerHTML = "";
        await refreshDiscountAndRenderCart();
        return;
    }
    const subtotal = getCartSubtotal();
    if (subtotal <= 0) {
        if (statusEl) statusEl.innerHTML = `<span style="color:#facc15;">Đã chọn mã ${code}. Hãy thêm món vào giỏ để tính giảm giá!</span>`;
        return;
    }
    try {
        const res = await api("/api/ops/discount/preview", {
            method: "POST",
            body: JSON.stringify({
                subtotal,
                voucherCode: code,
                user_id: orderCustomerState.customerType === "MEMBER" ? orderCustomerState.memberUser?.id : undefined
            })
        });
        orderCustomerState.discountPreview = res;
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#4ade80;">✅ Đã áp dụng mã <b>${code}</b>: Giảm <b>${Number(res.voucherDiscount || 0).toLocaleString("vi-VN")}đ</b></span>`;
        }
        renderCart();
    } catch (err) {
        orderCustomerState.voucherCode = "";
        orderCustomerState.discountPreview = null;
        if (statusEl) {
            statusEl.innerHTML = `<span style="color:#f87171;">❌ ${err.message}</span>`;
        }
        renderCart();
    }
}

/*==================================================
        CHECKOUT (HỖ TRỢ CẢ GUEST & MEMBER + VOUCHER)
==================================================*/
async function checkout() {
    if (cart.length === 0) {
        showToast("Giỏ hàng đang trống.");
        return;
    }

    const orderMode = document.getElementById("orderModeSelect")?.value || "DINE_IN";
    const voucherCode = (document.getElementById("voucherInput")?.value || orderCustomerState.voucherCode || "").trim().toUpperCase();
    const customNote = document.getElementById("orderNoteInput")?.value?.trim() || "";
    const isMember = orderCustomerState.customerType === "MEMBER";

    if (isMember && !orderCustomerState.memberUser) {
        const phoneInputVal = document.getElementById("memberPhoneInput")?.value?.trim();
        if (phoneInputVal) {
            await lookupMemberPhone(phoneInputVal);
        }
        if (!orderCustomerState.memberUser) {
            showToast("Vui lòng nhập SĐT thành viên và bấm 'Tìm' hoặc chuyển sang Khách vãng lai.");
            return;
        }
    }

    // Luồng 1: Đặt hàng Web Delivery
    if (orderMode === "DELIVERY") {
        const deliveryAddress = prompt("Nhập địa chỉ giao hàng tận nơi:");
        if (!deliveryAddress) return;
        const recipientPhone = prompt("Nhập số điện thoại người nhận:", orderCustomerState.memberUser?.phone || "");
        if (!recipientPhone) return;

        try {
            const result = await api("/api/ops/delivery/order", {
                method: "POST",
                body: JSON.stringify({
                    user_id: isMember ? orderCustomerState.memberUser?.id : null,
                    items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, note: item.note || "" })),
                    deliveryAddress,
                    recipientPhone,
                    voucherCode: voucherCode || null,
                    note: customNote,
                    paymentMethod: "PAYOS"
                })
            });
            showToast(result.message || "Đặt đơn giao hàng thành công!");
            cart = [];
            renderCart();
        } catch (error) {
            showToast(error.message);
        }
        return;
    }

    // Luồng 2: Khách ăn tại bàn (Guest hoặc Member)
    const selectedTableId = Number(document.getElementById("menuTableSelect")?.value || JSON.parse(sessionStorage.getItem("appdatmon_table") || "{}")?.id || 1);

    const body = {
        table_id: selectedTableId,
        customerType: isMember ? "MEMBER" : "GUEST",
        user_id: isMember ? orderCustomerState.memberUser?.id : null,
        customerPhone: isMember ? orderCustomerState.memberUser?.phone : null,
        used_points: isMember ? Number(orderCustomerState.usedPoints || 0) : 0,
        voucherCode: voucherCode || null,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            note: item.note || ""
        })),
        note: `${customNote || "Đặt món tại bàn"}${isMember ? ` [MEMBER:${orderCustomerState.memberUser?.phone}]` : " [GUEST]"}${voucherCode ? ` [VOUCHER:${voucherCode}]` : ""}`
    };

    try {
        const result = await api("/api/orders", {
            method: "POST",
            body: JSON.stringify(body)
        });
        showToast(result.message || "Đã gửi đơn xuống bếp thành công!");
        cart = [];
        orderCustomerState.usedPoints = 0;
        const ptsInput = document.getElementById("memberUsePointsInput");
        if (ptsInput) ptsInput.value = "0";
        renderCart();
        refreshGuestTableTracker(selectedTableId);
    } catch (error) {
        console.error("Checkout error:", error);
        showToast(error.message);
    }
}

async function refreshGuestTableTracker(tableId) {
    const box = document.getElementById("guestLiveOrderBox");
    if (!box) return;
    try {
        const orders = await api(`/api/orders/table/${tableId}`);
        if (!orders || !orders.length) {
            box.innerHTML = `<span style="color:#94a3b8;">Chưa có món nào đang chế biến tại Bàn #${tableId}.</span>`;
            return;
        }
        const stMap = {
            PENDING: "⏳ Chờ xác nhận",
            CONFIRMED: "✅ Đã xác nhận",
            PREPARING: "🔥 Bếp đang nấu",
            READY: "🍽️ Đã xong (Sẵn sàng phục vụ)"
        };
        box.innerHTML = `
            <div style="font-weight:700; color:#38bdf8; margin-bottom:6px;">📡 Đơn đang phục vụ tại Bàn #${tableId}</div>
            ${orders.map(o => `
                <div style="padding:6px 0; border-bottom:1px dashed #334155;">
                    <div><strong>Đơn #${o.id}</strong>: <span style="color:#fde047;">${stMap[o.status] || o.status}</span></div>
                    <div style="font-size:12px; color:#cbd5e1;">
                        Thành tiền: <strong>${Number(o.finalPrice).toLocaleString("vi-VN")}đ</strong>
                        ${Number(o.discountAmount) > 0 ? `<span style="color:#4ade80"> (Đã giảm ${Number(o.discountAmount).toLocaleString("vi-VN")}đ)</span>` : ""}
                    </div>
                </div>
            `).join("")}
            <button type="button" onclick="alert('Đã gửi yêu cầu thanh toán của Bàn #${tableId} tới quầy Thu ngân!')" style="margin-top:8px; width:100%; padding:8px; border-radius:8px; border:0; background:#16a34a; color:#fff; font-weight:700; cursor:pointer;">
                💳 Yêu cầu thanh toán (Tiền mặt / QR)
            </button>
        `;
    } catch (e) {}
}
