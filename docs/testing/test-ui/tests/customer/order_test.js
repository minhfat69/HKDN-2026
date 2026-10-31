Feature("Order Food");

Scenario("Khách thêm một món vào giỏ hàng", async ({ I }) => {
  I.amOnPage("/menu.html?qr=T5");

  I.waitForElement(".add-cart", 10);

  I.click(".add-cart");

  I.wait(2);

  I.seeElement(".cart-item");
});

Scenario("Khách thêm nhiều món khác nhau vào giỏ hàng", async ({ I }) => {
  I.amOnPage("/menu.html?qr=T5");

  I.waitForElement(".add-cart", 10);

  const buttons = await I.grabNumberOfVisibleElements(".add-cart");

  if (buttons >= 2) {
    I.click({ css: ".product-card:nth-child(1) .add-cart" });

    I.wait(1);

    I.click({ css: ".product-card:nth-child(2) .add-cart" });
  }

  I.wait(2);

  I.seeElement(".cart-item");
});

Scenario("Khách tăng số lượng món ăn", async ({ I }) => {
  I.amOnPage("/menu.html?qr=T5");

  I.waitForElement(".add-cart", 10);

  I.click(".add-cart");

  I.waitForElement(".quantity", 5);

  I.click(".quantity button:last-child");

  I.wait(2);

  I.seeElement(".cart-item");
});

Scenario("Khách giảm số lượng món ăn", async ({ I }) => {
  I.amOnPage("/menu.html?qr=T5");

  I.waitForElement(".add-cart", 10);

  I.click(".add-cart");

  I.waitForElement(".quantity", 5);

  I.click(".quantity button:first-child");

  I.wait(2);

  I.see("Chưa có món ăn.");
});

Scenario("Khách đặt món khi giỏ hàng trống", async ({ I }) => {
  I.amOnPage("/menu.html?qr=T5");

  I.waitForElement("#checkoutBtn", 10);

  I.click("#checkoutBtn");

  I.wait(2);
  I.see("Giỏ hàng đang trống");
});



Scenario("Người dùng đăng nhập và đặt món thành công", async ({ I }) => {
  I.amOnPage("/login.html");

  I.fillField("#account", "thinh");

  I.fillField("#password", "123");

  I.click("#loginForm button");

  I.wait(3);

  I.amOnPage("/menu.html?qr=T5");

  I.waitForElement(".add-cart", 10);

  I.click(".add-cart");

  I.wait(1);

  I.click("#checkoutBtn");

  I.wait(3);

  I.see("Chưa có món ăn.");
});