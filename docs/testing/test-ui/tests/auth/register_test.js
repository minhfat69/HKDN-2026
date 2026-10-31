Feature("Register");

Scenario("Đăng ký thành công", async ({ I }) => {
  const random = Date.now();

  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#fullName", "Nguyen Phuoc Thinh");

  I.fillField("#email", `thinh${random}@gmail.com`);

  I.fillField("#phone", `09${String(random).slice(-8)}`);

  I.fillField("#username", `thinh${random}`);

  I.fillField("#registerPassword", "123456");

  I.click("#registerForm button");

  I.wait(3);
});

Scenario("Bỏ trống toàn bộ thông tin", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Đăng ký");
});

Scenario("Bỏ trống họ tên", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#phone", "0987654321");

  I.fillField("#username", "testuser");

  I.fillField("#registerPassword", "123456");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Đăng ký");
});

Scenario("Bỏ trống số điện thoại", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#fullName", "Test User");

  I.fillField("#username", "testuser");

  I.fillField("#registerPassword", "123456");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Đăng ký");
});

Scenario("Bỏ trống username", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#fullName", "Test User");

  I.fillField("#phone", "0987654321");

  I.fillField("#registerPassword", "123456");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Đăng ký");
});

Scenario("Bỏ trống mật khẩu", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#fullName", "Test User");

  I.fillField("#phone", "0987654321");

  I.fillField("#username", "testuser");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Đăng ký");
});

Scenario("Đăng ký với username đã tồn tại", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#fullName", "Test User");

  I.fillField("#email", "test@gmail.com");

  I.fillField("#phone", "0999999999");

  I.fillField("#username", "thinh");

  I.fillField("#registerPassword", "123456");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Tên đăng nhập");
});

Scenario("Đăng ký với số điện thoại đã tồn tại", async ({ I }) => {
  I.amOnPage("/login.html");

  I.click("#registerTab");

  I.fillField("#fullName", "Test User");

  I.fillField("#email", "test@gmail.com");

  I.fillField("#phone", "0123456789");

  I.fillField("#username", `user${Date.now()}`);

  I.fillField("#registerPassword", "123456");

  I.click("#registerForm button");

  I.wait(2);

  I.see("Số điện thoại");
});