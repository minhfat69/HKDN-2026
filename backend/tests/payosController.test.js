const models = require('../src/models');

const mockCreateLink = jest.fn();
const mockGetLinkInfo = jest.fn();

jest.mock('@payos/node', () => {
  return {
    default: class PayOS {
      constructor() {
        this.paymentRequests = {
          create: mockCreateLink,
          getPaymentLinkInformation: mockGetLinkInfo
        };
        this.createPaymentLink = mockCreateLink;
        this.getPaymentLinkInformation = mockGetLinkInfo;
      }
    }
  };
});

const controller = require('../src/controllers/payosController');

jest.mock('../src/models', () => ({
  Order: { findAll: jest.fn(), findByPk: jest.fn(), findOne: jest.fn(), update: jest.fn() },
  RestaurantTable: { update: jest.fn() },
  Payment: { findOne: jest.fn(), findOrCreate: jest.fn() },
  sequelize: {}
}));

const makeResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

beforeAll(() => {
  process.env.PAYOS_CLIENT_ID = 'client';
  process.env.PAYOS_API_KEY = 'key';
  process.env.PAYOS_CHECKSUM_KEY = 'checksum';
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
  models.RestaurantTable.update.mockResolvedValue([1]);
});

describe('PAYOS CONTROLLER TESTS', () => {
  test('WB-PAYOS-01: createPaymentLink rejects request without orderId and tableId', async () => {
    const res = makeResponse();
    await controller.createPaymentLink({ body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Thiếu orderId hoặc tableId" });
  });

  test('WB-PAYOS-02: createPaymentLink returns 404 for missing single order', async () => {
    models.Order.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.createPaymentLink({ body: { orderId: 999 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy đơn hàng" });
  });

  test('WB-PAYOS-03: createPaymentLink creates link for single order and updates note', async () => {
    const order = { id: 10, finalPrice: 100, note: 'Ghi chú cũ', update: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    mockCreateLink.mockResolvedValue({ checkoutUrl: 'https://payos.test/checkout/10' });
    const res = makeResponse();
    await controller.createPaymentLink({ body: { orderId: 10 } }, res);

    expect(order.update).toHaveBeenCalledWith(expect.objectContaining({ note: expect.stringContaining('[PAYOS:') }));
    expect(res.json).toHaveBeenCalledWith({ checkoutUrl: 'https://payos.test/checkout/10' });
  });

  test('WB-PAYOS-04: createPaymentLink returns 404 if no unpaid orders found for tableId', async () => {
    models.Order.findAll.mockResolvedValue([]);
    const res = makeResponse();
    await controller.createPaymentLink({ body: { tableId: 99 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Không tìm thấy hóa đơn chưa thanh toán cho bàn này" });
  });

  test('WB-PAYOS-05: createPaymentLink aggregates multiple orders by tableId', async () => {
    const order1 = { id: 1, finalPrice: 100, note: null, update: jest.fn().mockResolvedValue() };
    const order2 = { id: 2, finalPrice: 200, note: '', update: jest.fn().mockResolvedValue() };
    models.Order.findAll.mockResolvedValue([order1, order2]);
    mockCreateLink.mockResolvedValue({ checkoutUrl: 'https://payos.test/checkout/table4' });
    const res = makeResponse();
    await controller.createPaymentLink({ body: { tableId: 4 } }, res);

    expect(models.Order.findAll).toHaveBeenCalledWith({ where: { table_id: 4, paymentStatus: 'UNPAID' } });
    expect(order1.update).toHaveBeenCalled();
    expect(order2.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ checkoutUrl: 'https://payos.test/checkout/table4' });
  });

  test('WB-PAYOS-06: createPaymentLink handles PayOS exception and returns 500', async () => {
    const order = { id: 10, finalPrice: 100, note: '', update: jest.fn() };
    models.Order.findByPk.mockResolvedValue(order);
    mockCreateLink.mockRejectedValue(new Error('PayOS connection error'));
    const res = makeResponse();
    await controller.createPaymentLink({ body: { orderId: 10 } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Lỗi kết nối PayOS" }));
  });

  test('WB-PAYOS-07: checkOrderStatus returns 404 for missing order', async () => {
    models.Order.findByPk.mockResolvedValue(null);
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 999 } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Order not found" });
  });

  test('WB-PAYOS-08: checkOrderStatus returns PAID immediately if already paid in DB', async () => {
    const order = { id: 10, paymentStatus: 'PAID' };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 10 } }, res);
    expect(res.json).toHaveBeenCalledWith({ status: 'PAID', message: 'Already paid' });
  });

  test('WB-PAYOS-09: checkOrderStatus returns current status if no PayOS code found in note', async () => {
    const order = { id: 10, note: 'Khong co code', paymentStatus: 'UNPAID' };
    models.Order.findByPk.mockResolvedValue(order);
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 10 } }, res);
    expect(res.json).toHaveBeenCalledWith({ status: 'UNPAID', message: 'No PayOS code found' });
  });

  test('WB-PAYOS-10: checkOrderStatus updates order and table when PayOS status is PAID', async () => {
    const order = { id: 10, note: '[PAYOS:12345678]', paymentStatus: 'UNPAID', table_id: 2, update: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    mockGetLinkInfo.mockResolvedValue({ status: 'PAID', amount: 500 });
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 10 } }, res);

    expect(order.update).toHaveBeenCalledWith({ paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: 'TRANSFER' });
    expect(models.RestaurantTable.update).toHaveBeenCalledWith({ status: 'AVAILABLE' }, { where: { id: 2 } });
    expect(res.json).toHaveBeenCalledWith({ status: 'PAID', message: 'Updated from PayOS' });
  });

  test('WB-PAYOS-11: checkOrderStatus updates order without table when PayOS is PAID', async () => {
    const order = { id: 10, note: '[PAYOS:12345678]', paymentStatus: 'UNPAID', table_id: null, update: jest.fn().mockResolvedValue() };
    models.Order.findByPk.mockResolvedValue(order);
    mockGetLinkInfo.mockResolvedValue({ status: 'PAID' });
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 10 } }, res);

    expect(order.update).toHaveBeenCalledWith({ paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: 'TRANSFER' });
    expect(models.RestaurantTable.update).not.toHaveBeenCalled();
  });

  test('WB-PAYOS-12: checkOrderStatus returns payosStatus when PayOS is PENDING', async () => {
    const order = { id: 10, note: '[PAYOS:12345678]', paymentStatus: 'UNPAID', update: jest.fn() };
    models.Order.findByPk.mockResolvedValue(order);
    mockGetLinkInfo.mockResolvedValue({ status: 'PENDING' });
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 10 } }, res);

    expect(res.json).toHaveBeenCalledWith({ status: 'UNPAID', payosStatus: 'PENDING' });
  });

  test('WB-PAYOS-13: checkOrderStatus handles exception and returns 500', async () => {
    models.Order.findByPk.mockRejectedValue(new Error('DB error in check'));
    const res = makeResponse();
    await controller.checkOrderStatus({ params: { orderId: 10 } }, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB error in check' });
  });

  test('WB-PAYOS-14: payosWebhook updates unpaid order and frees table on code 00', async () => {
    const order = { id: 10, paymentStatus: 'UNPAID', table_id: 3, update: jest.fn().mockResolvedValue() };
    models.Order.findOne.mockResolvedValue(order);
    const res = makeResponse();
    await controller.payosWebhook({ body: { code: '00', data: { orderCode: 12345678 } } }, res);

    expect(order.update).toHaveBeenCalledWith({ paymentStatus: 'PAID', status: 'COMPLETED', paymentMethod: 'TRANSFER' });
    expect(models.RestaurantTable.update).toHaveBeenCalledWith({ status: 'AVAILABLE' }, { where: { id: 3 } });
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  test('WB-PAYOS-15: payosWebhook skips already PAID order', async () => {
    const order = { id: 10, paymentStatus: 'PAID', update: jest.fn() };
    models.Order.findOne.mockResolvedValue(order);
    const res = makeResponse();
    await controller.payosWebhook({ body: { code: '00', data: { orderCode: 12345678 } } }, res);

    expect(order.update).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  test('WB-PAYOS-16: payosWebhook handles non-00 code safely', async () => {
    const res = makeResponse();
    await controller.payosWebhook({ body: { code: '01', desc: 'Cancelled' } }, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  test('WB-PAYOS-17: payosWebhook handles exceptions safely with status 200', async () => {
    models.Order.findOne.mockRejectedValue(new Error('webhook crash'));
    const res = makeResponse();
    await controller.payosWebhook({ body: { code: '00', data: { orderCode: 12345678 } } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error handled' });
  });

  test('WB-PAYOS-18: debugPayOS, paymentSuccess, and paymentCancel handlers', async () => {
    const res1 = makeResponse();
    await controller.debugPayOS({}, res1);
    expect(res1.json).toHaveBeenCalledWith(expect.objectContaining({ available: true }));

    const res2 = makeResponse();
    controller.paymentSuccess({}, res2);
    expect(res2.send).toHaveBeenCalledWith(expect.stringContaining('Thanh toán thành công'));

    const res3 = makeResponse();
    controller.paymentCancel({}, res3);
    expect(res3.send).toHaveBeenCalledWith(expect.stringContaining('Đã hủy thanh toán'));
  });
});
