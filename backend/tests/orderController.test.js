const models = require('../src/models');
const controller = require('../src/controllers/orderController');

jest.mock('../src/models', () => ({
  Order: { create: jest.fn(), findByPk: jest.fn(), findAll: jest.fn(), update: jest.fn(), destroy: jest.fn() },
  OrderItem: { bulkCreate: jest.fn() },
  Product: { findByPk: jest.fn() },
  RestaurantTable: { update: jest.fn() },
  User: { findByPk: jest.fn() },
  Reservation: { update: jest.fn() },
  sequelize: { transaction: jest.fn() }
}));

const makeResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const makeTransaction = () => ({ commit: jest.fn(), rollback: jest.fn() });

beforeAll(() => {
  // Silence console logs and errors during test execution
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.error.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
  models.sequelize.transaction.mockResolvedValue(makeTransaction());
  models.OrderItem.bulkCreate.mockResolvedValue([]);
  models.RestaurantTable.update.mockResolvedValue([1]);
  models.Reservation.update.mockResolvedValue([1]);
});

// ==========================================
// 1. STANDARD BVA TESTS (4n + 1 = 13 TCs)
// Input Variables: quantity (1..10), used_points (0..100), price (10..1000)
// ==========================================
describe('1. STANDARD BVA TEST CASES (4n + 1 = 13 TCs)', () => {
  test('BVA-BASE: All variables at Nominal (quantity=5, used_points=50, price=100)', async () => {
    const product = { id: 1, name: 'Dish', price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    const createdOrder = { id: 10 };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue(createdOrder);
    models.Order.findByPk.mockResolvedValue(createdOrder);

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(user.update).toHaveBeenCalledWith({ points: 50 }, expect.any(Object));
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 500, discountAmount: 50, finalPrice: 450 }), expect.any(Object));
  });

  test('BVA-Q-01: quantity = Min (1), used_points=50, price=100', async () => {
    const product = { id: 1, name: 'Dish', price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 100, discountAmount: 50, finalPrice: 50 }), expect.any(Object));
  });

  test('BVA-Q-02: quantity = Min+ (2), used_points=50, price=100', async () => {
    const product = { id: 1, name: 'Dish', price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 2 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 200, discountAmount: 50, finalPrice: 150 }), expect.any(Object));
  });

  test('BVA-Q-03: quantity = Max- (9), used_points=50, price=100', async () => {
    const product = { id: 1, name: 'Dish', price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 9 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 900, discountAmount: 50, finalPrice: 850 }), expect.any(Object));
  });

  test('BVA-Q-04: quantity = Max (10), used_points=50, price=100', async () => {
    const product = { id: 1, name: 'Dish', price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 10 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 1000, discountAmount: 50, finalPrice: 950 }), expect.any(Object));
  });

  test('BVA-P-01: used_points = Min (0), quantity=5, price=100', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 0, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 500, discountAmount: 0, finalPrice: 500 }), expect.any(Object));
  });

  test('BVA-P-02: used_points = Min+ (1), quantity=5, price=100', async () => {
    const product = { id: 1, price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 1, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(user.update).toHaveBeenCalledWith({ points: 99 }, expect.any(Object));
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 500, discountAmount: 1, finalPrice: 499 }), expect.any(Object));
  });

  test('BVA-P-03: used_points = Max- (99), quantity=5, price=100', async () => {
    const product = { id: 1, price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 99, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(user.update).toHaveBeenCalledWith({ points: 1 }, expect.any(Object));
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 500, discountAmount: 99, finalPrice: 401 }), expect.any(Object));
  });

  test('BVA-P-04: used_points = Max (100), quantity=5, price=100', async () => {
    const product = { id: 1, price: 100 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 100, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(user.update).toHaveBeenCalledWith({ points: 0 }, expect.any(Object));
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 500, discountAmount: 100, finalPrice: 400 }), expect.any(Object));
  });

  test('BVA-S-01: product price = Min (10), quantity=5, used_points=50', async () => {
    const product = { id: 1, price: 10 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 50, discountAmount: 50, finalPrice: 0 }), expect.any(Object));
  });

  test('BVA-S-02: product price = Min+ (20), quantity=5, used_points=50', async () => {
    const product = { id: 1, price: 20 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 100, discountAmount: 50, finalPrice: 50 }), expect.any(Object));
  });

  test('BVA-S-03: product price = Max- (900), quantity=5, used_points=50', async () => {
    const product = { id: 1, price: 900 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 4500, discountAmount: 50, finalPrice: 4450 }), expect.any(Object));
  });

  test('BVA-S-04: product price = Max (1000), quantity=5, used_points=50', async () => {
    const product = { id: 1, price: 1000 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 5 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 5000, discountAmount: 50, finalPrice: 4950 }), expect.any(Object));
  });
});

// ==========================================
// 2. ROBUSTNESS BVA TESTS (6n + 1 = 19 TCs)
// ==========================================
describe('2. ROBUSTNESS BVA TEST CASES (6n + 1 = 19 TCs)', () => {
  test('ROB-BASE: All variables at Nominal', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-Q-01: quantity = Min- (0)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 0 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-Q-02: quantity = Min (1)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 1 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-Q-03: quantity = Min+ (2)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 2 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-Q-04: quantity = Max- (9)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 9 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-Q-05: quantity = Max (10)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 10 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-Q-06: quantity = Max+ (11 - Large quantity)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 11 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-P-01: used_points = Min- (-1)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { used_points: -1, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-P-02: used_points = Min (0)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { used_points: 0, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-P-03: used_points = Min+ (1)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue({ id: 1, points: 100, update: jest.fn() });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 1, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-P-04: used_points = Max- (99)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue({ id: 1, points: 100, update: jest.fn() });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 99, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-P-05: used_points = Max (100)', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue({ id: 1, points: 100, update: jest.fn() });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 100, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-P-06: used_points = Max+ (101 - Over balance)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 100 });
    models.User.findByPk.mockResolvedValue({ id: 1, points: 100, update: jest.fn() });
    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 101, items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('không đủ') }));
  });

  test('ROB-S-01: product price = Min- (0)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 0 });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 0 }), expect.any(Object));
  });

  test('ROB-S-02: product price = Min (10)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 10 });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-S-03: product price = Min+ (20)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 20 });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-S-04: product price = Max- (900)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 900 });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-S-05: product price = Max (1000)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 1000 });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('ROB-S-06: product price = Max+ (1500)', async () => {
    models.Product.findByPk.mockResolvedValue({ id: 1, price: 1500 });
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 5 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// ==========================================
// 3. WHITE-BOX TEST CASES FOR ORDER CONTROLLER
// ==========================================
describe('3. WHITE-BOX TEST CASES FOR ORDER & PAYMENT', () => {
  test('WB-ORD-01: items missing or empty array', async () => {
    const res = makeResponse();
    await controller.createOrder({ body: { items: [] } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Đơn hàng phải có ít nhất một món ăn" });
  });

  test('WB-ORD-02: items is null or undefined', async () => {
    const res = makeResponse();
    await controller.createOrder({ body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('WB-ORD-03: Product not found by ID', async () => {
    models.Product.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 999, quantity: 1 }] } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Sản phẩm với ID 999 không tồn tại" });
  });

  test('WB-ORD-04: item with custom note and item without note', async () => {
    const product1 = { id: 1, price: 50 };
    const product2 = { id: 2, price: 70 };
    models.Product.findByPk.mockImplementation((id) => Promise.resolve(id === 1 ? product1 : product2));
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({
      body: {
        items: [
          { product_id: 1, quantity: 1, note: 'Không cay' },
          { product_id: 2, quantity: 2 }
        ]
      }
    }, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(models.OrderItem.bulkCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ product_id: 1, note: 'Không cay', totalPrice: 50 }),
        expect.objectContaining({ product_id: 2, note: '', totalPrice: 140 })
      ]),
      expect.any(Object)
    );
  });

  test('WB-ORD-05: user points deduction succeeds when user has enough points', async () => {
    const product = { id: 1, price: 100 };
    const user = { id: 1, points: 10, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 10, items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(user.update).toHaveBeenCalledWith({ points: 0 }, expect.any(Object));
    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ discountAmount: 10, finalPrice: 90 }), expect.any(Object));
  });

  test('WB-ORD-06: user points deduction fails when user points < used_points', async () => {
    const product = { id: 1, price: 100 };
    const user = { id: 1, points: 5, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 10, items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Số điểm tích lũy (5) không đủ để áp dụng (10)" });
  });

  test('WB-ORD-07: missing user in DB skips points deduction', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(null);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ body: { user_id: 999, used_points: 10, items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ discountAmount: 0, finalPrice: 100 }), expect.any(Object));
  });

  test('WB-ORD-08: discount greater than totalPrice sets finalPrice to 0', async () => {
    const product = { id: 1, price: 30 };
    const user = { id: 1, points: 100, update: jest.fn() };
    models.Product.findByPk.mockResolvedValue(product);
    models.User.findByPk.mockResolvedValue(user);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ user: { id: 1 }, body: { used_points: 50, items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(models.Order.create).toHaveBeenCalledWith(expect.objectContaining({ totalPrice: 30, discountAmount: 50, finalPrice: 0 }), expect.any(Object));
  });

  test('WB-ORD-09: table_id provided updates table status to OCCUPIED', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ body: { table_id: 5, items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(models.RestaurantTable.update).toHaveBeenCalledWith({ status: 'OCCUPIED' }, { where: { id: 5 }, transaction: expect.any(Object) });
  });

  test('WB-ORD-10: table_id omitted does not update table status', async () => {
    const product = { id: 1, price: 100 };
    models.Product.findByPk.mockResolvedValue(product);
    models.Order.create.mockResolvedValue({ id: 10 });
    models.Order.findByPk.mockResolvedValue({ id: 10 });

    const res = makeResponse();
    await controller.createOrder({ body: { items: [{ product_id: 1, quantity: 1 }] } }, res);

    expect(models.RestaurantTable.update).not.toHaveBeenCalled();
  });

  test('WB-ORD-11: getAllOrders without query parameters', async () => {
    models.Order.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = makeResponse();
    await controller.getAllOrders({ query: {} }, res);

    expect(models.Order.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: {} }));
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('WB-ORD-12: getAllOrders with status and paymentStatus query parameters', async () => {
    models.Order.findAll.mockResolvedValue([]);
    const res = makeResponse();
    await controller.getAllOrders({ query: { status: 'READY', paymentStatus: 'PAID' } }, res);

    expect(models.Order.findAll).toHaveBeenCalledWith(expect.objectContaining({
      where: { status: 'READY', paymentStatus: 'PAID' }
    }));
  });

  test('WB-ORD-13: getAllOrders database exception forwards to next', async () => {
    const err = new Error('db error');
    models.Order.findAll.mockRejectedValue(err);
    const next = jest.fn();
    await controller.getAllOrders({ query: {} }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-14: getOrderById found order returns 200', async () => {
    const order = { id: 1, totalPrice: 100 };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.getOrderById({ params: { id: 1 } }, res);
    expect(res.json).toHaveBeenCalledWith(order);
  });

  test('WB-ORD-15: getOrderById not found returns 404', async () => {
    models.Order.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.getOrderById({ params: { id: 999 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy đơn hàng" });
  });

  test('WB-ORD-16: getOrderById database exception forwards to next', async () => {
    const err = new Error('get error');
    models.Order.findByPk.mockRejectedValue(err);
    const next = jest.fn();
    await controller.getOrderById({ params: { id: 1 } }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-17: updateOrderStatus found order updates status successfully', async () => {
    const order = { id: 1, status: 'PENDING', update: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.updateOrderStatus({ params: { id: 1 }, body: { status: 'CONFIRMED' } }, res);

    expect(order.update).toHaveBeenCalledWith({ status: 'CONFIRMED' });
    expect(res.json).toHaveBeenCalledWith({ message: "Cập nhật trạng thái thành công", data: order });
  });

  test('WB-ORD-18: updateOrderStatus missing order returns 404', async () => {
    models.Order.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.updateOrderStatus({ params: { id: 999 }, body: { status: 'CANCELLED' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy đơn hàng" });
  });

  test('WB-ORD-19: updateOrderStatus exception forwards to next', async () => {
    const err = new Error('update error');
    models.Order.findByPk.mockRejectedValue(err);
    const next = jest.fn();
    await controller.updateOrderStatus({ params: { id: 1 }, body: { status: 'CANCELLED' } }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-20: deleteOrder found order destroys successfully', async () => {
    const order = { id: 1, destroy: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.deleteOrder({ params: { id: 1 } }, res);

    expect(order.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Xóa đơn hàng thành công" });
  });

  test('WB-ORD-21: deleteOrder missing order returns 404', async () => {
    models.Order.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.deleteOrder({ params: { id: 999 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy đơn hàng" });
  });

  test('WB-ORD-22: deleteOrder exception forwards to next', async () => {
    const err = new Error('delete error');
    models.Order.findByPk.mockRejectedValue(err);
    const next = jest.fn();
    await controller.deleteOrder({ params: { id: 1 } }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-23: getCurrentOrderByTable returns orders array', async () => {
    models.Order.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = makeResponse();
    await controller.getCurrentOrderByTable({ params: { tableId: 1 } }, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });

  test('WB-ORD-24: getCurrentOrderByTable returns empty array when no orders', async () => {
    models.Order.findAll.mockResolvedValue([]);
    const res = makeResponse();
    await controller.getCurrentOrderByTable({ params: { tableId: 1 } }, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('WB-ORD-25: getCurrentOrderByTable exception forwards to next', async () => {
    const err = new Error('table error');
    models.Order.findAll.mockRejectedValue(err);
    const next = jest.fn();
    await controller.getCurrentOrderByTable({ params: { tableId: 1 } }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-26: payAllOrdersByTable returns 404 when no unpaid orders', async () => {
    models.Order.findAll.mockResolvedValue([]);
    const res = makeResponse();
    await controller.payAllOrdersByTable({ params: { tableId: 1 }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy đơn hàng cần thanh toán" });
  });

  test('WB-ORD-27: payAllOrdersByTable returns 400 when an order is not READY or COMPLETED', async () => {
    models.Order.findAll.mockResolvedValue([{ id: 1, status: 'READY' }, { id: 2, status: 'PENDING' }]);
    const res = makeResponse();
    await controller.payAllOrdersByTable({ params: { tableId: 1 }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Không thể thanh toán. Có đơn hàng chưa hoàn thành chế biến.",
      invalidOrderIds: [2]
    }));
  });

  test('WB-ORD-28: payAllOrdersByTable successfully pays ready orders and frees table', async () => {
    models.Order.findAll.mockResolvedValue([{ id: 1, status: 'READY' }, { id: 2, status: 'COMPLETED' }]);
    models.Order.update.mockResolvedValue([2]);
    const res = makeResponse();
    await controller.payAllOrdersByTable({ params: { tableId: 5 }, body: { paymentMethod: 'TRANSFER' } }, res);

    expect(models.Order.update).toHaveBeenCalledWith(
      { paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: 'TRANSFER' },
      expect.objectContaining({ where: { id: [1, 2] } })
    );
    expect(models.RestaurantTable.update).toHaveBeenCalledWith(
      { status: 'AVAILABLE' },
      expect.objectContaining({ where: { id: 5 } })
    );
    expect(models.Reservation.update).toHaveBeenCalledWith(
      { status: 'COMPLETED' },
      expect.objectContaining({ where: { table_id: 5, status: 'CHECKED_IN' } })
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Đã thanh toán thành công 2 đơn hàng." });
  });

  test('WB-ORD-29: payAllOrdersByTable exception rolls back and forwards to next', async () => {
    const err = new Error('pay all error');
    models.Order.findAll.mockRejectedValue(err);
    const next = jest.fn();
    await controller.payAllOrdersByTable({ params: { tableId: 1 }, body: {} }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-30: payOrder returns 404 when order is not found', async () => {
    models.Order.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.payOrder({ params: { id: 999 }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy đơn hàng" });
  });

  test('WB-ORD-31: payOrder returns 400 when order is already PAID', async () => {
    models.Order.findByPk.mockResolvedValue({ id: 1, paymentStatus: 'PAID' });
    const res = makeResponse();
    await controller.payOrder({ params: { id: 1 }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Đơn hàng này đã được thanh toán trước đó" });
  });

  test('WB-ORD-32: payOrder returns 400 when order status is not READY or COMPLETED', async () => {
    models.Order.findByPk.mockResolvedValue({ id: 1, paymentStatus: 'UNPAID', status: 'PREPARING' });
    const res = makeResponse();
    await controller.payOrder({ params: { id: 1 }, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Đơn hàng phải ở trạng thái 'Chờ phục vụ' mới có thể thanh toán" });
  });

  test('WB-ORD-33: payOrder successfully pays order without table', async () => {
    const order = { id: 1, paymentStatus: 'UNPAID', status: 'READY', table_id: null, update: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.payOrder({ params: { id: 1 }, body: {} }, res);

    expect(order.update).toHaveBeenCalledWith(
      { paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: 'CASH' },
      expect.any(Object)
    );
    expect(models.RestaurantTable.update).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Thanh toán thành công. Bàn hiện đã sẵn sàng." });
  });

  test('WB-ORD-34: payOrder successfully pays order with table and completes reservation', async () => {
    const order = { id: 1, paymentStatus: 'UNPAID', status: 'READY', table_id: 3, update: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.payOrder({ params: { id: 1 }, body: { paymentMethod: 'TRANSFER' } }, res);

    expect(order.update).toHaveBeenCalledWith(
      { paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: 'TRANSFER' },
      expect.any(Object)
    );
    expect(models.RestaurantTable.update).toHaveBeenCalledWith(
      { status: 'AVAILABLE' },
      expect.objectContaining({ where: { id: 3 } })
    );
    expect(models.Reservation.update).toHaveBeenCalledWith(
      { status: 'COMPLETED' },
      expect.objectContaining({ where: { table_id: 3, status: 'CHECKED_IN' } })
    );
  });

  test('WB-ORD-35: payOrder database exception rolls back and forwards to next', async () => {
    const err = new Error('pay error');
    models.Order.findByPk.mockRejectedValue(err);
    const next = jest.fn();
    await controller.payOrder({ params: { id: 1 }, body: {} }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });

  test('WB-ORD-36: getMyOrders successfully returns user orders', async () => {
    models.Order.findAll.mockResolvedValue([{ id: 1, user_id: 5 }]);
    const res = makeResponse();
    await controller.getMyOrders({ user: { id: 5 } }, res);

    expect(models.Order.findAll).toHaveBeenCalledWith(expect.objectContaining({ where: { user_id: 5 } }));
    expect(res.json).toHaveBeenCalledWith([{ id: 1, user_id: 5 }]);
  });

  test('WB-ORD-37: getMyOrders exception forwards to next', async () => {
    const err = new Error('my orders error');
    models.Order.findAll.mockRejectedValue(err);
    const next = jest.fn();
    await controller.getMyOrders({ user: { id: 5 } }, makeResponse(), next);
    expect(next).toHaveBeenCalledWith(err);
  });
});
