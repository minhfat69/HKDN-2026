Feature("QR Test");

Scenario("Quét QR thành công và chuyển đến trang menu", async ({ I }) => {
  I.amOnPage("/index.html");

  I.waitForElement("#qrNavLink", 5);

  I.click("#qrNavLink");

  I.waitForElement("#qrLinkInput", 5);

  I.fillField(
    "#qrLinkInput",
    "http://127.0.0.1:5500/KCPM-2026/customer/table/T5"
  );

  I.click("#qrLinkBtn");

  I.wait(3);

  I.seeInCurrentUrl("menu.html");
});

Scenario("Nhập đường dẫn QR không hợp lệ", async ({ I }) => {
  I.amOnPage("/index.html");

  I.waitForElement("#qrNavLink", 5);

  I.click("#qrNavLink");

  I.waitForElement("#qrLinkInput", 5);

  I.fillField(
    "#qrLinkInput",
    "http://127.0.0.1:5500/KCPM-2026/customer/table/ABC"
  );

  I.click("#qrLinkBtn");

  I.wait(2);

  I.see("Không tìm thấy");
});

Scenario("Không nhập đường dẫn QR", async ({ I }) => {
  I.amOnPage("/index.html");

  I.waitForElement("#qrNavLink", 5);

  I.click("#qrNavLink");

  I.waitForElement("#qrLinkBtn", 5);

  I.click("#qrLinkBtn");

  I.wait(2);

  I.see("Vui lòng nhập mã bàn hoặc link QR.");
});