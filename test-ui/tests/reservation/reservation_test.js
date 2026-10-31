Feature('Customer - Đặt bàn');


Scenario('TC01 - Kiểm tra giao diện trang đặt bàn', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.see('Đặt bàn trực tuyến');

    I.see('Họ và tên');
    I.see('Số điện thoại');
    I.see('Số lượng khách');
    I.see('Ngày');
    I.see('Giờ');
    I.see('Ghi chú');
    I.see('Đặt bàn ngay');

    I.seeElement('#bookingForm');

    I.seeElement('#fullName');
    I.seeElement('#phone');
    I.seeElement('#numberOfGuests');
    I.seeElement('#reservationDate');
    I.seeElement('#reservationTime');
    I.seeElement('#note');

});


Scenario('TC02 - Kiểm tra lịch sử đặt bàn khi chưa đăng nhập', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.executeScript(() => {
        localStorage.clear();
    });

    I.refreshPage();

    I.see('Đăng nhập để xem lịch sử.');

});


Scenario('TC03 - Kiểm tra số lượng khách mặc định', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    const value = await I.grabValueFrom('#numberOfGuests');

    if (value !== '1') {

        throw new Error(
            `Số lượng khách mặc định sai. Expected: 1, Actual: ${value}`
        );

    }

});


Scenario('TC04 - Kiểm tra danh sách số lượng khách', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.click('#numberOfGuests');

    I.see('1 người');
    I.see('2 người');
    I.see('3 người');
    I.see('4 người');
    I.see('5 người');
    I.see('6 người');
    I.see('8 người');
    I.see('10 người');

});


Scenario('TC05 - Kiểm tra validation khi bỏ trống họ tên', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField('#phone', '0358055156');

    I.selectOption('#numberOfGuests', '2');

    I.fillField('#reservationDate', '2026-08-20');

    I.fillField('#reservationTime', '18:00');

    I.click('Đặt bàn ngay');

    I.wait(1);

    I.seeElement('#fullName:invalid');

});


Scenario('TC06 - Kiểm tra validation khi bỏ trống số điện thoại', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField('#fullName', 'Trần Minh Trí');

    I.selectOption('#numberOfGuests', '2');

    I.fillField('#reservationDate', '2026-08-20');

    I.fillField('#reservationTime', '18:00');

    I.click('Đặt bàn ngay');

    I.wait(1);

    I.seeElement('#phone:invalid');

});


Scenario('TC07 - Kiểm tra validation khi bỏ trống ngày', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField('#fullName', 'Trần Minh Trí');

    I.fillField('#phone', '0358055156');

    I.selectOption('#numberOfGuests', '2');

    I.fillField('#reservationTime', '18:00');

    I.click('Đặt bàn ngay');

    I.wait(1);

    I.seeElement('#reservationDate:invalid');

});


Scenario('TC08 - Kiểm tra validation khi bỏ trống giờ', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField('#fullName', 'Trần Minh Trí');

    I.fillField('#phone', '0358055156');

    I.selectOption('#numberOfGuests', '2');

    I.fillField('#reservationDate', '2026-08-20');

    I.click('Đặt bàn ngay');

    I.wait(1);

    I.seeElement('#reservationTime:invalid');

});


Scenario('TC09 - Kiểm tra ghi chú không bắt buộc', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField('#fullName', 'Trần Minh Trí');

    I.fillField('#phone', '0358055156');

    I.selectOption('#numberOfGuests', '2');

    I.fillField('#reservationDate', '2026-08-20');

    I.fillField('#reservationTime', '18:00');

    const note = await I.grabValueFrom('#note');

    if (note !== '') {

        throw new Error(
            `Ghi chú phải để trống mặc định. Actual: ${note}`
        );

    }

});


Scenario('TC10 - Kiểm tra nhập đầy đủ thông tin đặt bàn', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField('#fullName', 'Trần Minh Trí');

    I.fillField('#phone', '0358055156');

    I.selectOption('#numberOfGuests', '2');

    I.fillField('#reservationDate', '2026-08-20');

    I.fillField('#reservationTime', '18:00');

    I.fillField(
        '#note',
        'Sinh nhật, gần cửa sổ'
    );

    I.seeInField(
        '#fullName',
        'Trần Minh Trí'
    );

    I.seeInField(
        '#phone',
        '0358055156'
    );

    I.seeInField(
        '#numberOfGuests',
        '2'
    );

    I.seeInField(
        '#reservationTime',
        '18:00'
    );

    I.seeInField(
        '#note',
        'Sinh nhật, gần cửa sổ'
    );

    I.seeElement('#reservationDate');

});

Scenario('TC11 - Kiểm tra thay đổi số lượng khách', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.selectOption(
        '#numberOfGuests',
        '4'
    );

    I.seeInField(
        '#numberOfGuests',
        '4'
    );

});

Scenario('TC12 - Kiểm tra nhập ghi chú', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.fillField(
        '#note',
        'Sinh nhật, gần cửa sổ'
    );

    I.seeInField(
        '#note',
        'Sinh nhật, gần cửa sổ'
    );

});

Scenario('TC13 - Kiểm tra nút Đặt bàn ngay', async ({ I }) => {

    I.amOnPage('/customer/booking.html');

    I.seeElement(
        '#bookingForm button[type="submit"]'
    );

    I.see(
        'Đặt bàn ngay'
    );

});
