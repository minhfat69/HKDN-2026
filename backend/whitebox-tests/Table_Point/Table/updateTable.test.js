const {
    RestaurantTable,
    Order
} = require('../mocks/tableMocks');

jest.mock(
    '../../../../../backend/src/models',
    () => require('../mocks/tableMocks')
);

const tableController =
    require('../../../../../backend/src/controllers/tableController');

const {
    createMockResponse,
    createMockNext
} = require('../helpers/testHelpers');


// ============================================================
// UPDATE TABLE
// ============================================================

describe('Table Controller - updateTable', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-WB-004
    // Không tìm thấy bàn
    // ========================================================

    test(
        'TB-WB-004: cập nhật bàn không tồn tại trả về 404',
        async () => {

            const req = {
                params: {
                    id: 999
                },
                body: {
                    tableNumber: 6,
                    capacity: 4,
                    qrCode: 'T6',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findByPk
                .mockResolvedValue(null);

            RestaurantTable.findOne
                .mockResolvedValue(null);


            await tableController.updateTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findByPk
            ).toHaveBeenCalledWith(999);


            expect(
                RestaurantTable.findOne
            ).toHaveBeenCalled();


            expect(
                res.status
            ).toHaveBeenCalledWith(404);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Không tìm thấy bàn ăn'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-005
    // findByPk tìm thấy bàn
    // ========================================================

    test(
        'TB-WB-005: cập nhật bàn thành công khi tìm thấy bằng ID',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    tableNumber: 6,
                    capacity: 6,
                    qrCode: 'T6',
                    status: 'OCCUPIED'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            await tableController.updateTable(
                req,
                res,
                next
            );


            // Tìm thấy bằng ID nên không cần fallback
            expect(
                RestaurantTable.findByPk
            ).toHaveBeenCalledWith(5);


            expect(
                RestaurantTable.findOne
            ).not.toHaveBeenCalled();


            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                tableNumber: 6,
                capacity: 6,
                qrCode: 'T6',
                status: 'OCCUPIED'
            });


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Cập nhật bàn thành công',
                table: mockTable
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-006
    // findByPk không tìm thấy
    // nhưng findOne tìm thấy
    // ========================================================

    test(
        'TB-WB-006: cập nhật bàn khi findByPk không tìm thấy nhưng findOne tìm thấy',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    tableNumber: 7,
                    capacity: 8,
                    qrCode: 'T7',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(null);


            RestaurantTable.findOne
                .mockResolvedValue(mockTable);


            await tableController.updateTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findByPk
            ).toHaveBeenCalledWith(5);


            expect(
                RestaurantTable.findOne
            ).toHaveBeenCalled();


            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                tableNumber: 7,
                capacity: 8,
                qrCode: 'T7',
                status: 'AVAILABLE'
            });


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Cập nhật bàn thành công',
                table: mockTable
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-007
    // Không cho chuyển AVAILABLE khi còn đơn chưa thanh toán
    // ========================================================

    test(
        'TB-WB-007: không cho chuyển bàn sang AVAILABLE khi còn đơn chưa thanh toán',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                update: jest.fn()
            };


            const mockOrder = {
                id: 100
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            Order.findOne
                .mockResolvedValue(mockOrder);


            await tableController.updateTable(
                req,
                res,
                next
            );


            expect(
                Order.findOne
            ).toHaveBeenCalled();


            expect(
                mockTable.update
            ).not.toHaveBeenCalled();


            expect(
                res.status
            ).toHaveBeenCalledWith(400);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    "Không thể chuyển Bàn #5 về trạng thái 'Bàn trống' vì bàn này còn Đơn hàng #100 chưa thanh toán!"
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-008
    // Cho phép chuyển AVAILABLE
    // khi không còn đơn chưa thanh toán
    // ========================================================

    test(
        'TB-WB-008: cho phép chuyển bàn sang AVAILABLE khi không còn đơn chưa thanh toán',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            Order.findOne
                .mockResolvedValue(null);


            await tableController.updateTable(
                req,
                res,
                next
            );


            expect(
                Order.findOne
            ).toHaveBeenCalled();


            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE'
            });


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Cập nhật bàn thành công',
                table: mockTable
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-005
    // qrCode rỗng
    // ========================================================

    test(
        'TB-BVA-005: qrCode rỗng giữ nguyên QR hiện tại của bàn',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    tableNumber: 6,
                    capacity: 6,
                    qrCode: '',
                    status: 'OCCUPIED'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            await tableController.updateTable(
                req,
                res,
                next
            );


            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                tableNumber: 6,
                capacity: 6,
                qrCode: 'T5',
                status: 'OCCUPIED'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-006
    // status rỗng
    // ========================================================

    test(
        'TB-BVA-006: status rỗng giữ nguyên trạng thái hiện tại của bàn',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    tableNumber: 6,
                    capacity: 6,
                    qrCode: 'T6',
                    status: ''
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            await tableController.updateTable(
                req,
                res,
                next
            );


            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                tableNumber: 6,
                capacity: 6,
                qrCode: 'T6',
                status: 'OCCUPIED'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});