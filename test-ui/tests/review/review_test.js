Feature('Customer - Đánh giá');

Scenario('TC01 - Kiểm tra giao diện trang đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.see('Đánh giá nhà hàng');
    I.see('Đánh giá của bạn');
    I.see('Tiêu đề');
    I.see('Nội dung');
    I.see('Gửi đánh giá');
    I.see('Khách hàng nói gì');

    I.seeElement('#reviewForm');
    I.seeElement('#starRating');
    I.seeElement('#reviewTitle');
    I.seeElement('#reviewContent');
    I.seeElement('#reviewList');

});



Scenario('TC02 - Kiểm tra hiển thị đủ 5 ngôi sao', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    const count = await I.grabNumberOfVisibleElements(
        '#starRating i'
    );

    if (count !== 5) {

        throw new Error(
            `Số lượng ngôi sao không đúng. Expected: 5, Actual: ${count}`
        );

    }

});



Scenario('TC03 - Kiểm tra đánh giá mặc định là 5 sao', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    for (let i = 1; i <= 5; i++) {

        I.seeElement(
            `#starRating i[data-value="${i}"].active`
        );

    }

});


Scenario('TC04 - Kiểm tra chọn 1 sao', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.click('#starRating i[data-value="1"]');

    I.seeElement(
        '#starRating i[data-value="1"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="2"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="3"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="4"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="5"].active'
    );

});


Scenario('TC05 - Kiểm tra chọn 3 sao', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.click('#starRating i[data-value="3"]');

    I.seeElement(
        '#starRating i[data-value="1"].active'
    );

    I.seeElement(
        '#starRating i[data-value="2"].active'
    );

    I.seeElement(
        '#starRating i[data-value="3"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="4"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="5"].active'
    );

});


Scenario('TC06 - Kiểm tra chọn lại 5 sao', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.click('#starRating i[data-value="3"]');

    I.click('#starRating i[data-value="5"]');

    for (let i = 1; i <= 5; i++) {

        I.seeElement(
            `#starRating i[data-value="${i}"].active`
        );

    }

});

Scenario('TC07 - Kiểm tra nhập tiêu đề đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.fillField(
        '#reviewTitle',
        'Nhà hàng rất tuyệt'
    );

    I.seeInField(
        '#reviewTitle',
        'Nhà hàng rất tuyệt'
    );

});

Scenario('TC08 - Kiểm tra nhập nội dung đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.fillField(
        '#reviewContent',
        'Món ăn ngon, không gian đẹp và nhân viên nhiệt tình.'
    );

    I.seeInField(
        '#reviewContent',
        'Món ăn ngon, không gian đẹp và nhân viên nhiệt tình.'
    );

});


Scenario('TC09 - Kiểm tra placeholder của form đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    const titlePlaceholder = await I.grabAttributeFrom(
        '#reviewTitle',
        'placeholder'
    );

    if (titlePlaceholder !== 'Ví dụ: Nhà hàng rất tuyệt') {

        throw new Error(
            `Placeholder tiêu đề không đúng. Actual: ${titlePlaceholder}`
        );

    }

    const contentPlaceholder = await I.grabAttributeFrom(
        '#reviewContent',
        'placeholder'
    );

    if (contentPlaceholder !== 'Hãy chia sẻ cảm nhận của bạn...') {

        throw new Error(
            `Placeholder nội dung không đúng. Actual: ${contentPlaceholder}`
        );

    }

});


Scenario('TC10 - Kiểm tra nút Gửi đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.seeElement(
        '#reviewForm button[type="submit"]'
    );

    I.see('Gửi đánh giá');

});


Scenario('TC11 - Kiểm tra form đánh giá khi chưa nhập dữ liệu', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    const title = await I.grabValueFrom(
        '#reviewTitle'
    );

    const content = await I.grabValueFrom(
        '#reviewContent'
    );

    if (title !== '') {

        throw new Error(
            `Tiêu đề phải trống mặc định. Actual: ${title}`
        );

    }

    if (content !== '') {

        throw new Error(
            `Nội dung phải trống mặc định. Actual: ${content}`
        );

    }

});


Scenario('TC12 - Kiểm tra nhập đầy đủ thông tin đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.click(
        '#starRating i[data-value="5"]'
    );

    I.fillField(
        '#reviewTitle',
        'Dịch vụ xuất sắc'
    );

    I.fillField(
        '#reviewContent',
        'Không gian đẹp, món ăn ngon và phục vụ rất tốt.'
    );

    I.seeInField(
        '#reviewTitle',
        'Dịch vụ xuất sắc'
    );

    I.seeInField(
        '#reviewContent',
        'Không gian đẹp, món ăn ngon và phục vụ rất tốt.'
    );

    I.seeElement(
        '#starRating i[data-value="5"].active'
    );

});


Scenario('TC13 - Kiểm tra gửi đánh giá khi chưa đăng nhập', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.executeScript(() => {

        localStorage.removeItem('user');
        localStorage.removeItem('token');

    });

    I.fillField(
        '#reviewTitle',
        'Đánh giá thử nghiệm'
    );

    I.fillField(
        '#reviewContent',
        'Nội dung đánh giá thử nghiệm.'
    );

    I.click(
        '#starRating i[data-value="5"]'
    );

    I.click(
        '#reviewForm button[type="submit"]'
    );

    I.wait(1);

    I.see('Vui lòng đăng nhập.');

});


Scenario('TC14 - Kiểm tra khu vực danh sách đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.seeElement('#reviewList');

});


Scenario('TC15 - Kiểm tra thông tin thống kê đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.see('4.9');
    I.see('Trung bình');

    I.see('500+');
    I.see('Đánh giá');

});

Scenario('TC16 - Kiểm tra thay đổi nhiều mức đánh giá', async ({ I }) => {

    I.amOnPage('/customer/review.html');

    I.click(
        '#starRating i[data-value="2"]'
    );

    I.seeElement(
        '#starRating i[data-value="1"].active'
    );

    I.seeElement(
        '#starRating i[data-value="2"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="3"].active'
    );

    I.click(
        '#starRating i[data-value="4"]'
    );

    I.seeElement(
        '#starRating i[data-value="1"].active'
    );

    I.seeElement(
        '#starRating i[data-value="2"].active'
    );

    I.seeElement(
        '#starRating i[data-value="3"].active'
    );

    I.seeElement(
        '#starRating i[data-value="4"].active'
    );

    I.dontSeeElement(
        '#starRating i[data-value="5"].active'
    );

});