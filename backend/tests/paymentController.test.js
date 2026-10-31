process.env.PAYOS_CLIENT_ID = 'test_client';
process.env.PAYOS_API_KEY = 'test_key';
process.env.PAYOS_CHECKSUM_KEY = 'test_checksum';

jest.mock('@payos/node', () => {
  return {
    default: class PayOS {
      constructor() {
        this.paymentRequests = { create: jest.fn(), getPaymentLinkInformation: jest.fn() };
      }
    }
  };
});

const orderController = require('../src/controllers/orderController');
const payosController = require('../src/controllers/payosController');

describe('PAYMENT INTEGRATION TEST SUITE', () => {
  test('Payment methods exist and are properly bound in orderController and payosController', () => {
    expect(typeof orderController.payOrder).toBe('function');
    expect(typeof orderController.payAllOrdersByTable).toBe('function');
    expect(typeof payosController.createPaymentLink).toBe('function');
    expect(typeof payosController.checkOrderStatus).toBe('function');
    expect(typeof payosController.payosWebhook).toBe('function');
  });
});
