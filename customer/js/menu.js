/*==================================================
                REQUIRE QR SCAN
==================================================*/

async function verifyTableQr() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const qr =
        params.get("qr") ||
        sessionStorage.getItem(
            "appdatmon_table_qr"
        );

    if (!qr) {

        showToast(
            "Vui lòng quét mã QR tại bàn."
        );

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1000);

        return false;
    }

    try {

        const table = await api(
            `/api/tables/qr/${encodeURIComponent(qr)}`
        );

        if (!table) {

            throw new Error(
                "Mã QR không hợp lệ."
            );

        }

        sessionStorage.setItem(
            "appdatmon_table_qr",
            qr
        );

        sessionStorage.setItem(
            "appdatmon_table",
            JSON.stringify(table)
        );

        console.log(
            "QR verified:",
            table
        );

        return true;

    } catch (error) {

        console.error(
            "QR verification error:",
            error
        );

        sessionStorage.removeItem(
            "appdatmon_table_qr"
        );

        sessionStorage.removeItem(
            "appdatmon_table"
        );

        showToast(
            "Mã QR không hợp lệ hoặc bàn không tồn tại."
        );

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 1000);

        return false;
    }
}


/*==================================================
                    MENU
==================================================*/

const productGrid =
    document.getElementById("productGrid");

const categorySelect =
    document.getElementById("categorySelect");

const searchInput =
    document.getElementById("searchInput");

const cartItems =
    document.getElementById("cartItems");

const totalPrice =
    document.getElementById("totalPrice");


let products = [];

let categories = [];

let cart = [];


/*==================================================
                    INIT
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
         * Kiểm tra các element cần thiết
         */

        if (
            !productGrid ||
            !categorySelect ||
            !searchInput ||
            !cartItems ||
            !totalPrice
        ) {

            console.error(
                "Không tìm thấy element của menu."
            );

            return;

        }


        /*
         * QUAN TRỌNG:
         * Phải xác thực QR trước
         */

        const verified =
            await verifyTableQr();


        if (!verified) {

            return;

        }


        /*
         * QR hợp lệ
         * mới tải menu
         */

        await loadCategories();

        await loadProducts();

        renderCart();


        /*
         * Search
         */

        searchInput.addEventListener(
            "input",
            renderProducts
        );


        /*
         * Category
         */

        categorySelect.addEventListener(
            "change",
            renderProducts
        );


        /*
         * Checkout
         */

        const checkoutBtn =
            document.getElementById(
                "checkoutBtn"
            );


        if (checkoutBtn) {

            checkoutBtn.addEventListener(
                "click",
                checkout
            );

        }

    }
);


/*==================================================
                    CATEGORY
==================================================*/

async function loadCategories() {

    try {

        categories =
            await api(
                "/api/categories"
            );


        categorySelect.innerHTML = `

            <option value="">

                Tất cả danh mục

            </option>

        `;


        categories.forEach(
            category => {

                categorySelect.innerHTML += `

                    <option value="${category.id}">

                        ${category.name}

                    </option>

                `;

            }
        );

    } catch (error) {

        console.error(
            "Load categories error:",
            error
        );

    }

}


/*==================================================
                    PRODUCT
==================================================*/

async function loadProducts() {

    try {

        products =
            await api(
                "/api/products?available=true"
            );


        renderProducts();

    } catch (error) {

        console.error(
            "Load products error:",
            error
        );

        showToast(
            "Không tải được thực đơn."
        );

    }

}


/*==================================================
                RENDER PRODUCTS
==================================================*/

function renderProducts() {

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    const category =
        categorySelect.value;


    const list =
        products.filter(
            product => {

                const matchName =
                    product.name
                        .toLowerCase()
                        .includes(keyword);


                const matchCategory =
                    category === "" ||
                    String(product.category_id) ===
                    String(category);


                return (
                    matchName &&
                    matchCategory
                );

            }
        );


    productGrid.innerHTML = "";


    if (list.length === 0) {

        productGrid.innerHTML = `

            <div class="empty">

                Không có món ăn.

            </div>

        `;

        return;

    }


    list.forEach(
        renderCard
    );

}




/*==================================================
                PRODUCT IMAGE
==================================================*/

function getProductImage(product) {

    if (
        !product.image ||
        product.image.trim() === ""
    ) {
        return "./assets/images/no-image.png";
    }

    // Nếu database đã lưu URL đầy đủ
    if (
        product.image.startsWith("http://") ||
        product.image.startsWith("https://")
    ) {
        return product.image;
    }

    // Nếu database lưu /uploads/...
    if (product.image.startsWith("/")) {
        return `${window.location.origin}${product.image}`;
    }

    // Nếu database chỉ lưu tên file
    return `${window.location.origin}/uploads/${product.image}`;
}


/*==================================================
                PRODUCT CARD
==================================================*/

function renderCard(product) {

    const imageUrl =
        getProductImage(product);

    productGrid.innerHTML += `

        <div class="product-card">

            <div class="product-image">

                <img
                    src="${imageUrl}"
                    alt="${product.name}"
                    onerror="this.onerror=null; this.src='./assets/images/no-image.png';"
                >

            </div>

            <div class="product-content">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${
                        product.description ||
                        "Đang cập nhật mô tả..."
                    }
                </p>

                <div class="product-footer">

                    <div class="product-price">

                        ${
                            Number(product.price)
                                .toLocaleString("vi-VN")
                        }đ

                    </div>

                    <button
                        class="add-cart"
                        onclick="addToCart(${product.id})">

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

window.addToCart =
function(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) {

        return;

    }


    const item =
        cart.find(
            i => i.id === id
        );


    if (item) {

        item.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    renderCart();


    showToast(
        "Đã thêm vào giỏ hàng."
    );

};


/*==================================================
                RENDER CART
==================================================*/

function renderCart() {

    if (!cartItems || !totalPrice) {

        return;

    }


    cartItems.innerHTML = "";


    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                Chưa có món ăn.

            </div>

        `;


        totalPrice.innerHTML =
            "0đ";


        return;

    }


    cart.forEach(
        item => {

            total +=
                item.quantity *
                Number(item.price);


            cartItems.innerHTML += `

                <div class="cart-item">

                    <div class="cart-info">

                        <h4>

                            ${item.name}

                        </h4>

                        <span>

                            ${
                                Number(
                                    item.price
                                ).toLocaleString(
                                    "vi-VN"
                                )
                            }đ

                        </span>

                    </div>


                    <div class="quantity">

                        <button
                            onclick="minus(${item.id})">

                            -

                        </button>


                        <span>

                            ${item.quantity}

                        </span>


                        <button
                            onclick="plus(${item.id})">

                            +

                        </button>

                    </div>

                </div>

            `;

        }
    );


    totalPrice.innerHTML =
        total.toLocaleString(
            "vi-VN"
        ) + "đ";

}


/*==================================================
                    PLUS
==================================================*/

window.plus =
function(id) {

    const item =
        cart.find(
            p => p.id === id
        );


    if (!item) {

        return;

    }


    item.quantity++;

    renderCart();

};


/*==================================================
                    MINUS
==================================================*/

window.minus =
function(id) {

    const item =
        cart.find(
            p => p.id === id
        );


    if (!item) {

        return;

    }


    item.quantity--;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                p => p.id !== id
            );

    }


    renderCart();

};


/*==================================================
        CHECKOUT (HỖ TRỢ CẢ GUEST & CUSTOMER)
==================================================*/
async function checkout() {
    if (cart.length === 0) {
        showToast("Giỏ hàng đang trống.");
        return;
    }

    const orderMode = document.getElementById("orderModeSelect")?.value || "DINE_IN";
    const voucherCode = document.getElementById("voucherInput")?.value?.trim() || "";
    const customNote = document.getElementById("orderNoteInput")?.value?.trim() || "";

    // Luồng 1: Đặt hàng Web Delivery (Omnichannel - Thanh toán trực tuyến 100% trước khi giao)
    if (orderMode === "DELIVERY") {
        const deliveryAddress = prompt("Nhập địa chỉ giao hàng tận nơi:");
        if (!deliveryAddress) return;
        const recipientPhone = prompt("Nhập số điện thoại người nhận:");
        if (!recipientPhone) return;

        try {
            const result = await api("/api/ops/delivery/order", {
                method: "POST",
                body: JSON.stringify({
                    items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, note: item.note || "" })),
                    deliveryAddress,
                    recipientPhone,
                    voucherCode,
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

    // Luồng 2: Khách ăn tại bàn (Guest hoặc Customer quét QR) - KHÔNG BẮT ĐĂNG NHẬP
    const tableQr = sessionStorage.getItem("appdatmon_table_qr");
    const tableData = sessionStorage.getItem("appdatmon_table");

    if (!tableQr || !tableData) {
        showToast("Phiên QR không hợp lệ. Vui lòng quét lại.");
        setTimeout(() => { window.location.href = "index.html"; }, 1000);
        return;
    }

    const table = JSON.parse(tableData);
    const body = {
        table_id: table.id,
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            note: item.note || ""
        })),
        note: `${customNote || "Đặt món từ QR bàn"}${voucherCode ? ` [VOUCHER:${voucherCode}]` : ""}`
    };

    try {
        const result = await api("/api/orders", {
            method: "POST",
            body: JSON.stringify(body)
        });
        showToast(result.message || "Đã gửi đơn xuống bếp!");
        cart = [];
        renderCart();
        refreshGuestTableTracker(table.id);
    } catch (error) {
        console.error("Checkout error:", error);
        showToast(error.message);
    }
}

// Khung tiện ích: Chế độ đặt hàng, Ghi chú, Mã Voucher & Theo dõi trạng thái đơn trực tiếp tại bàn
function mountGuestOrderControls() {
    const cartPanel = document.querySelector(".cart-panel");
    if (!cartPanel || document.getElementById("guestExtraControls")) return;

    const extraDiv = document.createElement("div");
    extraDiv.id = "guestExtraControls";
    extraDiv.style.cssText = "margin-top:12px; display:grid; gap:8px; font-size:13px;";
    extraDiv.innerHTML = `
        <select id="orderModeSelect" style="padding:8px; border-radius:8px; background:#1e293b; color:#fff; border:1px solid #334155;">
            <option value="DINE_IN">🍽️ Ăn tại bàn (Quét QR - Guest/Member)</option>
            <option value="DELIVERY">🛵 Giao tận nơi (Web Delivery - Trả trước 100%)</option>
        </select>
        <input id="orderNoteInput" type="text" placeholder="📝 Ghi chú (VD: ít cay, không hành...)" style="padding:8px; border-radius:8px; background:#1e293b; color:#fff; border:1px solid #334155;" />
        <input id="voucherInput" type="text" placeholder="🎟️ Mã Voucher (VD: FUTURESUSHI50, VIP10)" style="padding:8px; border-radius:8px; background:#1e293b; color:#fff; border:1px solid #334155;" />
        <div id="guestLiveOrderBox" style="margin-top:8px; padding:10px; border-radius:10px; background:rgba(15,23,42,0.85); border:1px solid #334155;"></div>
    `;
    cartPanel.appendChild(extraDiv);

    const tableData = sessionStorage.getItem("appdatmon_table");
    if (tableData) {
        const t = JSON.parse(tableData);
        if (t?.id) {
            refreshGuestTableTracker(t.id);
            setInterval(() => refreshGuestTableTracker(t.id), 6000);
        }
    }
}

async function refreshGuestTableTracker(tableId) {
    const box = document.getElementById("guestLiveOrderBox");
    if (!box) return;
    try {
        const orders = await api(`/api/orders/table/${tableId}`);
        if (!orders || !orders.length) {
            box.innerHTML = `<span style="color:#94a3b8;">Chưa có món nào đang chế biến tại bàn này.</span>`;
            return;
        }
        const stMap = {
            PENDING: "⏳ Chờ xác nhận",
            CONFIRMED: "✅ Đã xác nhận",
            PREPARING: "🔥 Đang nấu",
            READY: "🍽️ Đã xong (Sẵn sàng phục vụ)"
        };
        box.innerHTML = `
            <div style="font-weight:700; color:#38bdf8; margin-bottom:6px;">📡 Trạng thái đơn tại Bàn #${tableId}</div>
            ${orders.map(o => `
                <div style="padding:6px 0; border-bottom:1px dashed #334155;">
                    <div><strong>Đơn #${o.id}</strong>: <span style="color:#fde047;">${stMap[o.status] || o.status}</span></div>
                    <div style="font-size:12px; color:#cbd5e1;">Thành tiền: ${Number(o.finalPrice).toLocaleString("vi-VN")}đ</div>
                </div>
            `).join("")}
            <button type="button" onclick="alert('Đã gửi yêu cầu thanh toán của Bàn #${tableId} tới quầy Thu ngân!')" style="margin-top:8px; width:100%; padding:8px; border-radius:8px; border:0; background:#16a34a; color:#fff; font-weight:700; cursor:pointer;">
                💳 Yêu cầu thanh toán (Tiền mặt / QR)
            </button>
        `;
    } catch (e) {}
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(mountGuestOrderControls, 500);
});