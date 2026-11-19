/*==================================================
                BOOKING
==================================================*/

const bookingForm = document.getElementById("bookingForm");
const reservationList = document.getElementById("reservationList");
let matchedMemberForBooking = null;
let phoneCheckTimer = null;

/*==================================================
                INIT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {
    if (!bookingForm) return;

    // Điền mặc định ngày hôm nay & giờ hiện tại + 1 tiếng
    const dateInput = document.getElementById("reservationDate");
    const timeInput = document.getElementById("reservationTime");
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }
    if (timeInput && !timeInput.value) {
        timeInput.value = "19:00";
    }

    // Tạo badge thông báo Thành viên / Khách vãng lai ngay dưới ô SĐT
    const phoneInput = document.getElementById("phone");
    if (phoneInput && !document.getElementById("bookingPhoneMemberBadge")) {
        const badgeEl = document.createElement("div");
        badgeEl.id = "bookingPhoneMemberBadge";
        badgeEl.style.cssText = "font-size:12.5px; margin-top:4px; color:#94a3b8;";
        badgeEl.textContent = "💡 Nhập SĐT để hệ thống tự động nhận diện Thành viên tích điểm hoặc Khách vãng lai.";
        phoneInput.parentElement.appendChild(badgeEl);

        phoneInput.addEventListener("input", e => {
            clearTimeout(phoneCheckTimer);
            const val = e.target.value.trim();
            phoneCheckTimer = setTimeout(() => checkBookingPhoneMember(val), 250);
        });
    }

    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (user) {
        if (document.getElementById("fullName")) document.getElementById("fullName").value = user.fullName || "";
        if (phoneInput && user.phone) {
            phoneInput.value = user.phone;
            checkBookingPhoneMember(user.phone);
        }
    }

    bookingForm.addEventListener("submit", submitBooking);
    loadReservations();
});

async function checkBookingPhoneMember(phoneStr) {
    const badgeEl = document.getElementById("bookingPhoneMemberBadge");
    if (!badgeEl) return;
    const clean = String(phoneStr || "").trim();
    if (clean.length < 6) {
        matchedMemberForBooking = null;
        badgeEl.innerHTML = `<span style="color:#94a3b8;">👤 Khách vãng lai (Nhập SĐT đã đăng ký để đồng bộ Thành viên)</span>`;
        return;
    }
    try {
        const member = await api(`/api/ops/members/lookup?phone=${encodeURIComponent(clean)}`);
        matchedMemberForBooking = member;
        const nameInput = document.getElementById("fullName");
        if (nameInput && !nameInput.value.trim() && member.fullName) {
            nameInput.value = member.fullName;
        }
        badgeEl.innerHTML = `<span style="color:#4ade80; font-weight:600;">⭐ Thành viên: ${member.fullName} (Hạng ${member.tier || "MEMBER"} • ${Number(member.points || 0).toLocaleString("vi-VN")} điểm) — Tự động đồng bộ vào Bàn!</span>`;
    } catch (_) {
        matchedMemberForBooking = null;
        badgeEl.innerHTML = `<span style="color:#facc15;">👤 Khách vãng lai (SĐT chưa đăng ký tài khoản thành viên)</span>`;
    }
}


/*==================================================
            CREATE RESERVATION
==================================================*/

async function submitBooking(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    const effectiveUserId = user?.id || matchedMemberForBooking?.id || null;

    const body = {
        guestName: document.getElementById("fullName").value.trim(),
        guestPhone: document.getElementById("phone").value.trim(),
        reservationTime: `${document.getElementById("reservationDate").value} ${document.getElementById("reservationTime").value}:00`,
        numberOfGuests: Number(document.getElementById("numberOfGuests").value),
        note: document.getElementById("note").value.trim(),
        user_id: effectiveUserId
    };

    try {
        const result = await api("/api/reservations", {
            method: "POST",
            body: JSON.stringify(body)
        });

        showToast(result.message || "Đặt bàn thành công!");
        const savedPhone = body.guestPhone;
        bookingForm.reset();

        if (user) {
            document.getElementById("fullName").value = user.fullName || "";
            if (user.phone) document.getElementById("phone").value = user.phone;
        } else if (savedPhone) {
            document.getElementById("phone").value = savedPhone;
        }

        loadReservations();
    } catch (error) {
        console.log(error);
        showToast(error.message);
    }
}


/*==================================================
            HISTORY
==================================================*/

async function loadReservations() {
    const token = localStorage.getItem(TOKEN_KEY);
    const phoneVal = document.getElementById("phone")?.value?.trim() || "";

    try {
        if (token) {
            const data = await api("/api/reservations/my-reservations");
            renderReservations(data);
            return;
        }

        if (phoneVal.length >= 6) {
            const all = await api("/api/reservations");
            const matched = Array.isArray(all) ? all.filter(r => String(r.guestPhone || "").includes(phoneVal)) : [];
            renderReservations(matched);
            return;
        }

        reservationList.innerHTML = `
            <div class="empty">
                Nhập SĐT đặt bàn hoặc Đăng nhập để xem lịch sử đặt bàn của bạn.
            </div>
        `;
    } catch (error) {
        console.log(error);
    }
}


function renderReservations(list){

reservationList.innerHTML="";

if(!list.length){

reservationList.innerHTML=

`

<div class="empty">

Chưa có lịch đặt bàn.

</div>

`;

return;

}

list.forEach(renderReservation);

}



/*==================================================
            RENDER RESERVATION
==================================================*/

function renderReservation(item) {
    const isMember = Boolean(item.isMember || item.user_id || item.User);
    const memberBadge = isMember
        ? `<span style="display:inline-block; padding:3px 9px; border-radius:99px; background:rgba(244,180,0,0.18); color:#fde047; font-size:11.5px; font-weight:700; margin-bottom:8px;">⭐ Thành viên (${item.memberTier || item.User?.tier || "MEMBER"})</span>`
        : `<span style="display:inline-block; padding:3px 9px; border-radius:99px; background:rgba(255,255,255,0.08); color:#cbd5e1; font-size:11.5px; font-weight:600; margin-bottom:8px;">👤 Khách vãng lai</span>`;

    reservationList.innerHTML += `
    <div class="reservation-item">
        ${memberBadge}
        <h4>
            ${formatDate(item.reservationTime)} ${item.table_id ? `• Bàn #${item.Table?.tableNumber || item.table_id}` : ""}
        </h4>

        <p>

            🕒 ${formatTime(item.reservationTime)}

        </p>

        <p>

            👥 ${item.numberOfGuests} người

        </p>

        <p>

             📞 ${item.guestPhone}

        </p>

        <p>

            📝 ${item.note || "Không có"}

        </p>

        <span class="status ${statusClass(item.status)}">

            ${statusText(item.status)}

        </span>

        ${item.status === "PENDING"
            ? `

            <button

                class="btn btn-secondary"

                style="margin-top:15px;width:100%;"

                onclick="cancelReservation(${item.id})">

                Hủy đặt bàn

            </button>

            `
            : ""
        }

    </div>

    `;

}


/*==================================================
            STATUS
==================================================*/

function statusClass(status){

    switch(status){

        case "PENDING":
            return "pending";

        case "CONFIRMED":
            return "confirmed";

        case "CHECKED_IN":
            return "checkedin";

        case "COMPLETED":
            return "completed";

        case "CANCELLED":
            return "cancelled";

        default:
            return "pending";

    }

}

function statusText(status){

    switch(status){

        case "PENDING":
            return "Chờ xác nhận";

        case "CONFIRMED":
            return "Đã xác nhận";

        case "CHECKED_IN":
            return "Đã nhận bàn";

        case "COMPLETED":
            return "Hoàn thành";

        case "CANCELLED":
            return "Đã hủy";

        default:
            return status;

    }

}


/*==================================================
            FORMAT DATE
==================================================*/

function formatDate(date){

    return new Date(date)

    .toLocaleDateString(

        "vi-VN"

    );

}

function formatTime(date){

    return new Date(date).toLocaleTimeString(

        "vi-VN",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}


/*==================================================
            CANCEL
==================================================*/

window.cancelReservation = async function(id){

    if(

        !confirm(

            "Bạn có chắc muốn hủy đặt bàn?"

        )

    ) return;

    try{

        const result=

        await api(

            `/api/reservations/${id}/cancel`,

            {

                method:"PUT"

            }

        );

        showToast(

            result.message ||

            "Đã hủy đặt bàn."

        );

        loadReservations();

    }

    catch(error){

        console.log(error);

        showToast(

            error.message

        );

    }

}


const user = JSON.parse(localStorage.getItem(USER_KEY));

if(user){

    document.getElementById("fullName").value = user.fullName || "";

}

