const {
    User,
    Order,
    sequelize
} = require('../mocks/pointMocks');

jest.mock(
    '../../../../../backend/src/models',
    () => require('../mocks/pointMocks')
);

const pointController =
    require('../../../../../backend/src/controllers/pointController');

const {
    createMockResponse,
    createMockNext
} = require('../helpers/testHelpers');


// ============================================================
// ADD POINTS FROM ORDER
// ============================================================

describe('Point Controller - addPointsFromOrder', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        sequelize.transaction.mockResolvedValue({
            commit: jest.fn().mockResolvedValue(),
            rollback: jest.fn().mockResolvedValue()
        });
    });


    // ========================================================
    // WB-POINT-001
    // Thiếu phone hoặc orderId
    // ========================================================

    test(
        'WB-POINT-001: thiếu phone hoặc orderId',
        async () => {

            const req = {
                body: {}
            };

            const res = createMockResponse();
            const next = createMockNext();

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(400);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Vui lòng nhập đầy đủ Số điện thoại và Mã hóa đơn'
            });

            expect(
                User.findOne
            ).not.toHaveBeenCalled();

            expect(
                Order.findByPk
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // WB-POINT-002
    // Không tìm thấy khách hàng
    // ========================================================

    test(
        'WB-POINT-002: không tìm thấy khách hàng',
        async () => {

            const req = {
                body: {
                    phone: '0900000000',
                    orderId: 1
                }
            };

            const res = createMockResponse();
            const next = createMockNext();

            User.findOne
                .mockResolvedValue(null);

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            expect(
                User.findOne
            ).toHaveBeenCalledWith({
                where: {
                    phone: '0900000000'
                }
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(404);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Không tìm thấy khách hàng với số điện thoại này'
            });

            expect(
                Order.findByPk
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // WB-POINT-003
    // Không tìm thấy hóa đơn
    // ========================================================

    test(
        'WB-POINT-003: không tìm thấy hóa đơn',
        async () => {

            const req = {
                body: {
                    phone: '0900000000',
                    orderId: 999
                }
            };

            const res = createMockResponse();
            const next = createMockNext();

            User.findOne
                .mockResolvedValue({
                    id: 1,
                    phone: '0900000000',
                    fullName: 'Nguyễn Văn A',
                    points: 100
                });

            Order.findByPk
                .mockResolvedValue(null);

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            expect(
                Order.findByPk
            ).toHaveBeenCalledWith(999);

            expect(
                res.status
            ).toHaveBeenCalledWith(404);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Không tìm thấy mã hóa đơn này trong hệ thống'
            });

        }
    );


    // ========================================================
    // WB-POINT-004
    // Đơn hàng chưa thanh toán / chưa hoàn thành
    // ========================================================

    test(
        'WB-POINT-004: đơn hàng chưa hoàn thành hoặc chưa thanh toán',
        async () => {

            const req = {
                body: {
                    phone: '0900000000',
                    orderId: 1
                }
            };

            const res = createMockResponse();
            const next = createMockNext();

            User.findOne
                .mockResolvedValue({
                    id: 1,
                    phone: '0900000000',
                    fullName: 'Nguyễn Văn A',
                    points: 100
                });

            Order.findByPk
                .mockResolvedValue({
                    id: 1,
                    paymentStatus: 'UNPAID',
                    status: 'PENDING',
                    finalPrice: 200000,
                    isPointsAdded: false
                });

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(400);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Đơn hàng này chưa hoàn thành hoặc chưa thanh toán'
            });

        }
    );


    // ========================================================
    // WB-POINT-005
    // Đơn hàng đã tích điểm
    // ========================================================

    test(
        'WB-POINT-005: đơn hàng đã được tích điểm trước đó',
        async () => {

            const req = {
                body: {
                    phone: '0900000000',
                    orderId: 1
                }
            };

            const res = createMockResponse();
            const next = createMockNext();

            User.findOne
                .mockResolvedValue({
                    id: 1,
                    phone: '0900000000',
                    fullName: 'Nguyễn Văn A',
                    points: 100
                });

            Order.findByPk
                .mockResolvedValue({
                    id: 1,
                    paymentStatus: 'PAID',
                    status: 'COMPLETED',
                    finalPrice: 200000,
                    isPointsAdded: true
                });

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(400);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Đơn hàng này đã được tích điểm trước đó'
            });

        }
    );


    // ========================================================
    // WB-POINT-006
    // Tích điểm thành công
    // ========================================================

    test(
        'WB-POINT-006: tích điểm thành công',
        async () => {

            const req = {
                body: {
                    phone: '0900000000',
                    orderId: 1
                }
            };

            const res = createMockResponse();
            const next = createMockNext();

            const transaction = {
                commit: jest.fn().mockResolvedValue(),
                rollback: jest.fn().mockResolvedValue()
            };

            sequelize.transaction
                .mockResolvedValue(transaction);

            const user = {
                id: 1,
                phone: '0900000000',
                fullName: 'Nguyễn Văn A',
                points: 100,

                increment: jest.fn()
                    .mockResolvedValue()
            };

            const order = {
                id: 1,
                paymentStatus: 'PAID',
                status: 'COMPLETED',
                finalPrice: 200000,
                isPointsAdded: false,

                update: jest.fn()
                    .mockResolvedValue()
            };

            User.findOne
                .mockResolvedValue(user);

            Order.findByPk
                .mockResolvedValue(order);

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            // 200000 * 0.05 = 10000
            const expectedPoints = 10000;

            expect(
                user.increment
            ).toHaveBeenCalledWith(
                'points',
                {
                    by: expectedPoints,
                    transaction
                }
            );

            expect(
                order.update
            ).toHaveBeenCalledWith(
                {
                    isPointsAdded: true
                },
                {
                    transaction
                }
            );

            expect(
                transaction.commit
            ).toHaveBeenCalled();

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Tích điểm thành công cho khách hàng Nguyễn Văn A',
                earnedPoints: 10000,
                totalPoints: 10100
            });

            expect(
                transaction.rollback
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // WB-POINT-007
    // Lỗi hệ thống
    // ========================================================

    test(
        'WB-POINT-007: xử lý lỗi hệ thống và rollback transaction',
        async () => {

            const req = {
                body: {
                    phone: '0900000000',
                    orderId: 1
                }
            };

            const res = createMockResponse();
            const next = createMockNext();

            const transaction = {
                commit: jest.fn().mockResolvedValue(),
                rollback: jest.fn().mockResolvedValue()
            };

            sequelize.transaction
                .mockResolvedValue(transaction);

            User.findOne
                .mockRejectedValue(
                    new Error('Database error')
                );

            await pointController.addPointsFromOrder(
                req,
                res,
                next
            );

            expect(
                transaction.rollback
            ).toHaveBeenCalled();

            expect(
                res.status
            ).toHaveBeenCalledWith(500);

            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Lỗi hệ thống khi tích điểm',
                error: 'Database error'
            });

        }
    );

});