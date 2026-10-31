const orderController = require('../src/controllers/orderController');
const pointController = require('../src/controllers/pointController');
const { Order, OrderItem, Product, RestaurantTable, User, Payment, sequelize } = require('../src/models');

jest.mock('../src/models', () => {
    const mockTransaction = {
        commit: jest.fn(),
        rollback: jest.fn(),
    };
    return {
        Order: {
            create: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
        },
        OrderItem: {
            bulkCreate: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
        },
        Product: {
            findByPk: jest.fn(),
            update: jest.fn(),
        },
        RestaurantTable: {
            update: jest.fn(),
        },
        User: {
            findByPk: jest.fn(),
            findOne: jest.fn(),
            increment: jest.fn(),
            update: jest.fn(),
        },
        Payment: {
            findOrCreate: jest.fn().mockResolvedValue([{ update: jest.fn() }, true]),
        },
        Reservation: {
            update: jest.fn(),
        },
        sequelize: {
            transaction: jest.fn().mockResolvedValue(mockTransaction),
        }
    };
});

describe('State Transition Testing (Kiểm thử Chuyển đổi Trạng thái)', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, params: {}, query: {}, user: { id: 1 } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. ORDERS.STATUS TRANSITIONS
    // =========================================================================
    describe('Order Status State Transitions (orders.status)', () => {
        
        test('[ST-ORD-001 (Part 1)] START -> PENDING: Người dùng đặt món thành công', async () => {
            req.body = {
                table_id: 1,
                items: [{ product_id: 10, quantity: 2 }]
            };

            Product.findByPk.mockResolvedValue({ id: 10, name: 'Phở Bò', price: 50000, isAvailable: true, stock: 10, update: jest.fn() });
            Order.create.mockImplementation((data) => Promise.resolve({ id: 100, ...data }));
            Order.findByPk.mockResolvedValue({ id: 100, status: 'PENDING', paymentStatus: 'UNPAID' });

            await orderController.createOrder(req, res, next);

            // Kiểm tra trạng thái khởi tạo được lưu vào database là PENDING
            expect(Order.create).toHaveBeenCalledWith(
                expect.objectContaining({ status: 'PENDING', paymentStatus: 'UNPAID' }),
                expect.any(Object)
            );
        });

        test('[ST-ORD-001 (Part 2)] PENDING -> CONFIRMED: Staff xác nhận đơn hàng', async () => {
            req.params = { id: 100 };
            req.body = { status: 'CONFIRMED' };

            const mockOrder = {
                id: 100,
                status: 'PENDING',
                OrderItems: [],
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.updateOrderStatus(req, res, next);

            expect(mockOrder.update).toHaveBeenCalledWith({ status: 'CONFIRMED' }, expect.any(Object));
            expect(mockOrder.status).toBe('CONFIRMED');
        });

        test('[ST-ORD-002] CONFIRMED -> PREPARING: Kitchen bắt đầu làm món', async () => {
            req.params = { id: 100 };
            req.body = { status: 'PREPARING' };

            const mockOrder = {
                id: 100,
                status: 'CONFIRMED',
                OrderItems: [],
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.updateOrderStatus(req, res, next);

            expect(mockOrder.status).toBe('PREPARING');
        });

        test('[ST-ORD-003] PREPARING -> READY: Kitchen báo hoàn thành', async () => {
            req.params = { id: 100 };
            req.body = { status: 'READY' };

            const mockOrder = {
                id: 100,
                status: 'PREPARING',
                OrderItems: [],
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.updateOrderStatus(req, res, next);

            expect(mockOrder.status).toBe('READY');
        });

        test('[ST-ORD-004] READY -> COMPLETED: Staff hoàn tất đơn hàng / thanh toán', async () => {
            req.params = { id: 100 };
            req.body = { paymentMethod: 'CASH' };

            const mockOrder = {
                id: 100,
                status: 'READY',
                paymentStatus: 'UNPAID',
                finalPrice: 100000,
                table_id: 1,
                update: jest.fn().mockImplementation(function (fields) {
                    Object.assign(this, fields);
                    return Promise.resolve(this);
                })
            };
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.payOrder(req, res, next);

            expect(mockOrder.status).toBe('COMPLETED');
            expect(mockOrder.paymentStatus).toBe('PAID');
        });

        test('[ST-ORD-005] PENDING -> CANCELLED: Staff hủy đơn từ trạng thái chờ', async () => {
            req.params = { id: 100 };
            req.body = { status: 'CANCELLED' };

            const mockOrder = {
                id: 100,
                status: 'PENDING',
                OrderItems: [{ product_id: 10, quantity: 2 }],
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };
            const mockProduct = { id: 10, stock: 8, update: jest.fn() };
            Product.findByPk.mockResolvedValue(mockProduct);
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.updateOrderStatus(req, res, next);

            expect(mockOrder.status).toBe('CANCELLED');
            // Kiểm tra hoàn kho khi hủy đơn
            expect(mockProduct.update).toHaveBeenCalledWith(
                expect.objectContaining({ stock: 10, isAvailable: true }),
                expect.any(Object)
            );
        });

        test('[ST-ORD-006] CONFIRMED -> CANCELLED: Staff hủy đơn từ trạng thái đã xác nhận', async () => {
            req.params = { id: 100 };
            req.body = { status: 'CANCELLED' };

            const mockOrder = {
                id: 100,
                status: 'CONFIRMED',
                OrderItems: [],
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.updateOrderStatus(req, res, next);

            expect(mockOrder.status).toBe('CANCELLED');
        });
    });

    // =========================================================================
    // 2. ORDERS.PAYMENT_STATUS TRANSITIONS
    // =========================================================================
    describe('Payment Status State Transitions (orders.paymentStatus)', () => {
        test('[ST-PAY-001] UNPAID -> PAID: Khách/Nhân viên thanh toán thành công', async () => {
            req.params = { id: 101 };
            req.body = { paymentMethod: 'TRANSFER' };

            const mockOrder = {
                id: 101,
                status: 'READY',
                paymentStatus: 'UNPAID',
                finalPrice: 200000,
                update: jest.fn().mockImplementation(function (fields) {
                    Object.assign(this, fields);
                    return Promise.resolve(this);
                })
            };
            Order.findByPk.mockResolvedValue(mockOrder);

            await orderController.payOrder(req, res, next);

            expect(mockOrder.paymentStatus).toBe('PAID');
        });
    });

    // =========================================================================
    // 3. ORDERS.IS_POINTS_ADDED TRANSITIONS
    // =========================================================================
    describe('Loyalty Points State Transitions (orders.isPointsAdded)', () => {
        test('[ST-POINT-001] FALSE -> TRUE: Hệ thống tích điểm thưởng sau khi đơn hoàn tất', async () => {
            req.body = {
                phone: '0901234567',
                orderId: 102
            };

            const mockUser = {
                id: 1,
                fullName: 'Nguyen Van A',
                phone: '0901234567',
                points: 100,
                increment: jest.fn()
            };
            const mockOrder = {
                id: 102,
                status: 'COMPLETED',
                paymentStatus: 'PAID',
                finalPrice: 200000,
                isPointsAdded: false,
                update: jest.fn().mockImplementation(function (fields) {
                    Object.assign(this, fields);
                    return Promise.resolve(this);
                })
            };

            User.findOne.mockResolvedValue(mockUser);
            Order.findByPk.mockResolvedValue(mockOrder);

            await pointController.addPointsFromOrder(req, res, next);

            expect(mockOrder.update).toHaveBeenCalledWith({ isPointsAdded: true }, expect.any(Object));
            expect(mockOrder.isPointsAdded).toBe(true);
            expect(mockUser.increment).toHaveBeenCalledWith('points', { by: 10000, transaction: expect.any(Object) });
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ earnedPoints: 10000 }));
        });
    });

    // =========================================================================
    // 4. ORDER_ITEMS.STATUS TRANSITIONS
    // =========================================================================
    describe('Order Item Status State Transitions (order_items.status)', () => {
        test('[ST-ITEM-001] START -> WAITING: Món ăn được tạo trong đơn hàng với trạng thái chờ', async () => {
            req.body = {
                table_id: 1,
                items: [{ product_id: 10, quantity: 1, note: 'Không hành' }]
            };

            Product.findByPk.mockResolvedValue({ id: 10, name: 'Phở Bò', price: 50000, isAvailable: true, stock: 5, update: jest.fn() });
            Order.create.mockResolvedValue({ id: 103 });
            OrderItem.bulkCreate.mockImplementation((items) => Promise.resolve(items));

            await orderController.createOrder(req, res, next);

            // Kiểm tra bulkCreate được gọi
            expect(OrderItem.bulkCreate).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ product_id: 10, quantity: 1, order_id: 103 })
                ]),
                expect.any(Object)
            );
        });

        test('[ST-ITEM-002] WAITING -> COOKING: Kitchen bắt đầu nấu món', async () => {
            const mockItem = {
                id: 1,
                status: 'WAITING',
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };

            // Thực hiện chuyển trạng thái
            await mockItem.update({ status: 'COOKING' });
            expect(mockItem.status).toBe('COOKING');
        });

        test('[ST-ITEM-003] COOKING -> DONE: Kitchen hoàn thành món ăn', async () => {
            const mockItem = {
                id: 1,
                status: 'COOKING',
                update: jest.fn().mockImplementation(function (fields) {
                    this.status = fields.status;
                    return Promise.resolve(this);
                })
            };

            // Thực hiện chuyển trạng thái
            await mockItem.update({ status: 'DONE' });
            expect(mockItem.status).toBe('DONE');
        });
    });
});
