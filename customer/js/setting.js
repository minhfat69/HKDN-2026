/*==================================================
                    SETTING PAGE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    updateHeader();

    const items =
        document.querySelectorAll(
            ".setting-item[data-section]"
        );

    items.forEach(item => {

        item.addEventListener("click", () => {

            const section =
                item.dataset.section;

            openSettingSection(section);

            setTimeout(() => {

                const settingContent =
                    document.getElementById(
                        "settingContent"
                    );

                if (settingContent) {

                    settingContent.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 100);

        });

    });


    /*================ LOGOUT ================*/

    const logoutBtn =
        document.getElementById("settingLogout");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            if (typeof logout === "function") {
                logout();
            }

        });

    }

});


/*==================================================
                    AUTH CHECK
==================================================*/

function checkSettingLogin() {

    if (
        typeof isLogin === "function" &&
        isLogin()
    ) {

        return true;

    }

    showToast(
        "Vui lòng đăng nhập trước."
    );

    setTimeout(() => {

        window.location.href =
            "login.html";

    }, 700);

    return false;
}


/*==================================================
                    OPEN SECTION
==================================================*/

async function openSettingSection(section) {

    if (!checkSettingLogin()) {
        return;
    }

    const content =
        document.getElementById(
            "settingContent"
        );

    if (!content) {
        return;
    }


    switch (section) {

        case "account":

            renderAccount(content);

            break;


        case "orders":

            await renderOrders(content);

            break;


        case "bookings":

            await renderBookings(content);

            break;


        case "reviews":

            await renderReviews(content);

            break;

        case "points":

             renderPoints(content);
     
        break;


        case "password":

            renderChangePassword(content);

            break;

    }

}


/*==================================================
            ACCOUNT INFORMATION
==================================================*/

function renderAccount(content) {

    const user = getCurrentUser();

    if (!user) {

        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-empty">

                    <i class="fa-solid fa-user-slash"></i>

                    Không tìm thấy thông tin tài khoản.

                </div>

            </div>

        `;

        return;
    }


    content.innerHTML = `

        <div class="setting-panel">

            <div class="setting-panel-title">


                <h2>
                    Thông tin tài khoản
                </h2>

            </div>


            <form
                id="accountForm"
                class="setting-form">

                <div>

                    <label>Họ và tên</label>

                    <input
                        id="accountFullName"
                        type="text"
                        value="${escapeSettingHtml(user.fullName || '')}"
                        placeholder="Nhập họ và tên">

                </div>


                <div>

                    <label>Tên đăng nhập</label>

                    <input
                        id="accountUsername"
                        type="text"
                        value="${escapeSettingHtml(user.username || '')}"
                        placeholder="Tên đăng nhập">

                </div>


                <div>

                    <label>Email</label>

                    <input
                        id="accountEmail"
                        type="email"
                        value="${escapeSettingHtml(user.email || '')}"
                        placeholder="Nhập email">

                </div>


                <div>

                    <label>Số điện thoại</label>

                    <input
                        id="accountPhone"
                        type="text"
                        value="${escapeSettingHtml(user.phone || '')}"
                        placeholder="Nhập số điện thoại">

                </div>


                <button
                    type="submit"
                    class="btn btn-primary">

                    <i class="fa-solid fa-floppy-disk"></i>

                    Lưu thay đổi

                </button>

            </form>

        </div>

    `;


    document
        .getElementById("accountForm")
        .addEventListener(
            "submit",
            updateAccount
        );

}


function escapeSettingHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/*==================================================
                    ORDERS
==================================================*/

async function renderOrders(content) {

    content.innerHTML = `

        <div class="setting-panel">

            <div class="setting-panel-title">

                <i class="fa-solid fa-receipt"></i>

                <h2>
                    Lịch sử đơn hàng
                </h2>

            </div>

            <div class="setting-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Đang tải đơn hàng...

            </div>

        </div>

    `;


    try {

        const orders =
            await api("/api/orders");


        if (
            !orders ||
            orders.length === 0
        ) {

            content.innerHTML = `

                <div class="setting-panel">

                    <div class="setting-empty">

                        <i class="fa-solid fa-receipt"></i>

                        <p>
                            Bạn chưa có đơn hàng nào.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-panel-title">

                    <i class="fa-solid fa-receipt"></i>

                    <h2>
                        Lịch sử đơn hàng
                    </h2>

                </div>


                ${orders.map(order => `

                    <div class="history-item">

                        <div class="history-top">

                            <span class="history-title">
                                Đơn hàng #${order.id}
                            </span>

                            <span class="history-date">

                                ${
                                    order.created_at
                                    ? new Date(
                                        order.created_at
                                    ).toLocaleString("vi-VN")
                                    : ""
                                }

                            </span>

                        </div>


                        <div class="history-info">

                            Trạng thái:

                            <strong>
                                ${
                                    order.status ||
                                    "Đang xử lý"
                                }
                            </strong>

                        </div>


                        <div class="history-price">

                            ${
                                Number(
                                    order.total_amount ||
                                    order.total ||
                                    0
                                ).toLocaleString("vi-VN")
                            }đ

                        </div>

                    </div>

                `).join("")}

            </div>

        `;

    }
    catch (error) {

        console.error(error);

        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-empty">

                    Không thể tải lịch sử đơn hàng.

                </div>

            </div>

        `;

    }

}


/*==================================================
                    BOOKINGS
==================================================*/

async function renderBookings(content) {

    content.innerHTML = `

        <div class="setting-panel">

            <div class="setting-panel-title">

                <i class="fa-solid fa-calendar-check"></i>

                <h2>
                    Lịch sử đặt bàn
                </h2>

            </div>

            <div class="setting-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Đang tải lịch sử...

            </div>

        </div>

    `;


    try {

        const bookings =
            await api("/api/reservations");


        if (
            !bookings ||
            bookings.length === 0
        ) {

            content.innerHTML = `

                <div class="setting-panel">

                    <div class="setting-empty">

                        <i class="fa-solid fa-calendar-xmark"></i>

                        <p>
                            Bạn chưa có lịch đặt bàn.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-panel-title">

                    <i class="fa-solid fa-calendar-check"></i>

                    <h2>
                        Lịch sử đặt bàn
                    </h2>

                </div>


                ${bookings.map(booking => `

                    <div class="history-item">

                        <div class="history-top">

                            <span class="history-title">

                                Đặt bàn #${booking.id}

                            </span>

                            <span class="history-date">

                                ${
                                    booking.created_at
                                    ? new Date(
                                        booking.created_at
                                    ).toLocaleString("vi-VN")
                                    : ""
                                }

                            </span>

                        </div>


                        <div class="history-info">

                            Thời gian:

                            ${
                                booking.booking_time ||
                                booking.reservation_time ||
                                booking.time ||
                                "Chưa cập nhật"
                            }

                            <br>

                            Số người:

                            ${
                                booking.number_of_people ||
                                booking.guests ||
                                booking.people ||
                                "Chưa cập nhật"
                            }

                            <br>

                            Trạng thái:

                            <strong>
                                ${
                                    booking.status ||
                                    "Đang xử lý"
                                }
                            </strong>

                        </div>

                    </div>

                `).join("")}

            </div>

        `;

    }
    catch (error) {

        console.error(error);

        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-empty">

                    Không thể tải lịch sử đặt bàn.

                </div>

            </div>

        `;

    }

}


/*==================================================
                    REVIEWS
==================================================*/

async function renderReviews(content) {

    content.innerHTML = `

        <div class="setting-panel">

            <div class="setting-panel-title">

                <i class="fa-solid fa-star"></i>

                <h2>
                    Đánh giá của tôi
                </h2>

            </div>

            <div class="setting-loading">

                <i class="fa-solid fa-spinner fa-spin"></i>

                Đang tải đánh giá...

            </div>

        </div>

    `;


    try {

        const user =
            getCurrentUser();


        if (!user) {

            content.innerHTML = `

                <div class="setting-panel">

                    <div class="setting-empty">

                        <i class="fa-solid fa-user-lock"></i>

                        <h3>
                            Vui lòng đăng nhập
                        </h3>

                        <p>
                            Bạn cần đăng nhập để xem đánh giá.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        /*================ API CŨ ================*/

        const data =
            await api("/api/reviews");


        const reviews =
            data.reviews || [];


        /*================ LỌC THEO USER ================*/

        const myReviews =
            reviews.filter(review => {

                return String(review.user_id)
                    === String(user.id);

            });


        /*================ KHÔNG CÓ REVIEW ================*/

        if (myReviews.length === 0) {

            content.innerHTML = `

                <div class="setting-panel">

                    <div class="setting-empty">

                        <i class="fa-regular fa-star"></i>

                        <h3>
                            Chưa có đánh giá
                        </h3>

                        <p>
                            Bạn chưa gửi đánh giá nào.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        /*================ HIỂN THỊ REVIEW ================*/

        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-panel-title">

                    <i class="fa-solid fa-star"></i>

                    <h2>
                        Đánh giá của tôi
                    </h2>

                </div>


                <div class="my-reviews-list">

                    ${myReviews.map(review => {

                        const rating =
                            Number(
                                review.rating || 0
                            );


                        const stars =
                            "★".repeat(rating) +
                            "☆".repeat(
                                Math.max(
                                    0,
                                    5 - rating
                                )
                            );


                        return `

                            <div class="my-review-card">

                                <div class="my-review-header">

                                    <div>

                                        <h3>
                                            ${
                                                review.dish_name ||
                                                "FutureSuShi"
                                            }
                                        </h3>

                                        <div class="my-review-stars">

                                            ${stars}

                                        </div>

                                    </div>


                                    <span class="review-rating">

                                        ${rating}/5

                                    </span>

                                </div>


                                <p class="my-review-content">

                                    ${
                                        review.content ||
                                        "Không có nội dung."
                                    }

                                </p>


                                <small>

                                    ${
                                        review.created_at
                                            ? new Date(
                                                review.created_at
                                            ).toLocaleString(
                                                "vi-VN"
                                            )
                                            : ""
                                    }

                                </small>

                            </div>

                        `;

                    }).join("")}

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "Load reviews error:",
            error
        );


        content.innerHTML = `

            <div class="setting-panel">

                <div class="setting-empty">

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <h3>
                        Không thể tải đánh giá
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>

            </div>

        `;

    }

}

/*==================================================
                    POINTS
==================================================*/

function renderPoints(content) {

    content.innerHTML = `

        <div class="setting-panel">

            <div class="setting-panel-title">
                <i class="fa-solid fa-coins"></i>
                <h2>Điểm tích lũy</h2>
            </div>

            <div class="points-detail">

                <!-- HEADER -->

                <div class="points-detail-header">

                    <div>
                        <span class="points-label">
                            LOYALTY POINTS
                        </span>

                        <h2>
                            Điểm tích lũy
                        </h2>

                        <p>
                            Theo dõi điểm thưởng của bạn
                            tại FutureSuShi.
                        </p>
                    </div>

                    <div class="points-big-icon">
                        <i class="fa-solid fa-coins"></i>
                    </div>

                </div>


                <!-- TOTAL POINT -->

                <div class="points-main-card">

                    <span class="points-card-label">
                        TỔNG ĐIỂM HIỆN TẠI
                    </span>

                    <div
                        class="points-number"
                        id="settingPoints">

                        Đang tải...

                    </div>

                    <p>
                        Điểm thưởng hiện có của bạn.
                    </p>

                </div>


                <!-- MEMBER -->

                <div class="points-member-card">

                    <div class="points-member-icon">
                        <i class="fa-solid fa-medal"></i>
                    </div>

                    <div class="points-member-info">

                        <span>
                            HẠNG THÀNH VIÊN
                        </span>

                        <h3 id="settingRank">
                            Đang tải...
                        </h3>

                    </div>

                    <span
                        class="member-badge"
                        id="settingRankBadge">

                        MEMBER

                    </span>

                </div>


                <!-- PROGRESS -->

                <div class="points-progress-card">

                    <div class="points-progress-title">

                        <div>

                            <h3>
                                Tiến trình lên hạng
                            </h3>

                            <p id="settingNextRank">
                                Đang tải...
                            </p>

                        </div>

                        <strong id="settingPointProgress">
                            0 / 500
                        </strong>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            id="settingProgressBar"
                            style="width:0%">
                        </div>

                    </div>


                    <div class="progress-footer">

                        <span id="settingProgressPercent">
                            0%
                        </span>

                        <span id="settingRemaining">
                            Đang tải...
                        </span>

                    </div>

                </div>

            </div>

        </div>

    `;


    // Lấy điểm thật từ backend
    loadMyPoints();

}

async function loadMyPoints() {

    try {

        const token = localStorage.getItem("appdatmon_customer_token");

        if (!token) {

            showToast(
                "Vui lòng đăng nhập để xem điểm."
            );

            return;

        }


        const response = await fetch(
            `${window.location.origin}/api/points/me`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Không thể lấy thông tin điểm."
            );

        }


        const points = data.points || 0;

        const nextRankPoints =
            data.nextRankPoints || 500;

        const progress =
            data.progress || 0;

        const remaining =
            Math.max(
                nextRankPoints - points,
                0
            );


        // Tổng điểm

        const pointsElement =
            document.getElementById(
                "settingPoints"
            );

        if (pointsElement) {

            pointsElement.innerHTML =
                `${points} <small>điểm</small>`;

        }


        // Hạng

        const rankElement =
            document.getElementById(
                "settingRank"
            );

        if (rankElement) {

            rankElement.textContent =
                data.rank || "MEMBER";

        }


        // Badge

        const badgeElement =
            document.getElementById(
                "settingRankBadge"
            );

        if (badgeElement) {

            badgeElement.textContent =
                data.rank || "MEMBER";

        }


        // Hạng tiếp theo

        const nextRankElement =
            document.getElementById(
                "settingNextRank"
            );

        if (nextRankElement) {

            nextRankElement.textContent =
                `${data.rank || "MEMBER"} → ${data.nextRank || "SILVER"}`;

        }


        // Điểm hiện tại / điểm cần đạt

        const progressText =
            document.getElementById(
                "settingPointProgress"
            );

        if (progressText) {

            progressText.textContent =
                `${points} / ${nextRankPoints}`;

        }


        // Thanh tiến trình

        const progressBar =
            document.getElementById(
                "settingProgressBar"
            );

        if (progressBar) {

            progressBar.style.width =
                `${progress}%`;

        }


        // Phần trăm

        const progressPercent =
            document.getElementById(
                "settingProgressPercent"
            );

        if (progressPercent) {

            progressPercent.textContent =
                `${progress}%`;

        }


        // Điểm còn thiếu

        const remainingElement =
            document.getElementById(
                "settingRemaining"
            );

        if (remainingElement) {

            if (remaining === 0) {

                remainingElement.textContent =
                    "Đã đạt hạng tiếp theo";

            } else {

                remainingElement.textContent =
                    `Còn ${remaining} điểm`;

            }

        }


    } catch (error) {

        console.error(
            "Load points error:",
            error
        );

        showToast(
            error.message ||
            "Không thể tải thông tin tích điểm."
        );

    }

}



/*==================================================
                CHANGE PASSWORD
==================================================*/

function renderChangePassword(content) {

    content.innerHTML = `

        <div class="setting-panel">

            <div class="setting-panel-title">

                <i class="fa-solid fa-lock"></i>

                <h2>
                    Đổi mật khẩu
                </h2>

            </div>


            <form
                id="changePasswordForm"
                class="setting-form">


                <div>

                    <label>
                        Mật khẩu hiện tại
                    </label>

                    <input
                        id="currentPassword"
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        required>

                </div>


                <div>

                    <label>
                        Mật khẩu mới
                    </label>

                    <input
                        id="newPassword"
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        required>

                </div>


                <div>

                    <label>
                        Xác nhận mật khẩu mới
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        required>

                </div>


                <button
                    type="submit"
                    class="btn btn-primary">

                    <i class="fa-solid fa-key"></i>

                    Đổi mật khẩu

                </button>


            </form>

        </div>

    `;


    const form =
        document.getElementById(
            "changePasswordForm"
        );


    form.addEventListener(
        "submit",
        changePassword
    );

}


/*==================================================
                CHANGE PASSWORD API
==================================================*/

async function changePassword(event) {

    event.preventDefault();


    const currentPassword =
        document.getElementById(
            "currentPassword"
        ).value;


    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;


    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;


    if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
    ) {

        showToast(
            "Vui lòng nhập đầy đủ thông tin."
        );

        return;
    }


    if (
        newPassword !==
        confirmPassword
    ) {

        showToast(
            "Mật khẩu xác nhận không khớp."
        );

        return;
    }


    if (newPassword.length < 6) {

        showToast(
            "Mật khẩu mới phải có ít nhất 6 ký tự."
        );

        return;
    }


    try {

        const result =
            await api(
                "/api/auth/change-password",
                {
                    method: "PUT",

                    body: JSON.stringify({

                        currentPassword,

                        newPassword

                    })

                }
            );


        showToast(
            result.message ||
            "Đổi mật khẩu thành công."
        );


        document
            .getElementById(
                "changePasswordForm"
            )
            .reset();

    }

    catch (error) {

        console.error(error);

        showToast(
            error.message ||
            "Đổi mật khẩu thất bại."
        );

    }

}

