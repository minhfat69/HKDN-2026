/*==================================================
                REVIEW PAGE
==================================================*/

const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");
const stars = document.querySelectorAll("#starRating i");

let rating = 5;

stars.forEach(star => {
    star.addEventListener("click", () => {
        rating = Number(star.dataset.value);
        updateStars();
    });
});

function updateStars() {
    stars.forEach(star => {
        if (Number(star.dataset.value) <= rating) {
            star.classList.remove("fa-regular");
            star.classList.add("fa-solid");
            star.classList.add("active");
        } else {
            star.classList.remove("fa-solid");
            star.classList.add("fa-regular");
            star.classList.remove("active");
        }
    });
}

function escapeReviewHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderReview(review) {
    const reviewerName = review.user?.fullName || review.phone || "Khách hàng";
    const createdDate = review.created_at || review.createdAt
        ? new Date(review.created_at || review.createdAt).toLocaleDateString("vi-VN")
        : "";
    const replyDate = review.replied_at
        ? new Date(review.replied_at).toLocaleDateString("vi-VN")
        : "";

    reviewList.innerHTML += `
        <div class="review-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div>
                    <h3 style="margin-bottom:4px;">${escapeReviewHtml(reviewerName)}</h3>
                    <div class="stars" style="margin:6px 0;">${renderStars(review.rating)}</div>
                </div>
                ${createdDate ? `<small>${createdDate}</small>` : ""}
            </div>

            <strong style="display:inline-block; margin:8px 0 6px; color:#facc15;">
                <i class="fa-solid fa-utensils"></i> ${escapeReviewHtml(review.dish_name || "Đánh giá nhà hàng")}
            </strong>

            <p style="margin-bottom:14px;">"${escapeReviewHtml(review.content || "")}"</p>

            ${review.reply ? `
                <div class="restaurant-reply-box">
                    <div class="restaurant-reply-head">
                        <span><i class="fa-solid fa-reply"></i> Phản hồi từ Nhà hàng FutureSuShi</span>
                        ${replyDate ? `<small style="color:#a1a1aa; font-weight:400;">${replyDate}</small>` : ""}
                    </div>
                    <div>${escapeReviewHtml(review.reply)}</div>
                </div>
            ` : ""}
        </div>
    `;
}

if (reviewForm) {
    reviewForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        let user = null;
        try {
            user = JSON.parse(localStorage.getItem(USER_KEY));
        } catch (_) {}

        const dishName = document.getElementById("reviewTitle")?.value?.trim() || "Trải nghiệm tại FutureSuShi";
        const content = document.getElementById("reviewContent")?.value?.trim() || "";

        if (!content) {
            showToast("Vui lòng nhập nội dung đánh giá của bạn.");
            return;
        }

        let phone = user?.phone || null;
        if (!user) {
            phone = prompt("Nhập tên hoặc SĐT của bạn (để trống nếu muốn ẩn danh):", "Khách hàng") || "Khách vãng lai";
        }

        const body = {
            user_id: user?.id || null,
            phone,
            dish_name: dishName,
            content,
            rating
        };

        try {
            const result = await api("/api/reviews", {
                method: "POST",
                body: JSON.stringify(body)
            });
            showToast(result.message || "Cảm ơn bạn đã gửi đánh giá!");
            reviewForm.reset();
            rating = 5;
            updateStars();
            loadReviews();
        } catch (error) {
            showToast(error.message);
        }
    });
}

async function loadReviews() {
    try {
        const data = await api("/api/reviews?page=1&limit=50");
        renderReviews(data.reviews);
    } catch (error) {
        console.log(error);
    }
}

function renderReviews(reviews) {
    reviewList.innerHTML = "";
    if (!reviews || reviews.length === 0) {
        reviewList.innerHTML = `<div class="empty" style="grid-column:1/-1">Chưa có đánh giá.</div>`;
        return;
    }
    reviews.forEach(renderReview);
}

function renderStars(number) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= number) {
            html += '<i class="fa-solid fa-star active"></i>';
        } else {
            html += '<i class="fa-regular fa-star"></i>';
        }
    }
    return html;
}

updateStars();
loadReviews();
