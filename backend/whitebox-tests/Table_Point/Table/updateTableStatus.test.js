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
// UPDATE TABLE STATUS
// ============================================================

describe('Table Controller - updateTableStatus', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-WB-009
    // Không tìm thấy bàn
    // ========================================================

    test(
        'TB-WB-009: cập nhật trạng thái bàn không tồn tại trả về 404',
        async () => {

            const req = {
                params: {
                    id: 999
                },
                body: {
                    status: 'OCCUPIED'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            // Không tìm thấy bằng ID
            RestaurantTable.findByPk
                .mockResolvedValue(null);

            // Không tìm thấy bằng tableNumber
            RestaurantTable.findOne
                .mockResolvedValue(null);


            await tableController.updateTableStatus(
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
    // TB-WB-010
    // Cập nhật OCCUPIED thành công
    // ========================================================

    test(
        'TB-WB-010: cập nhật trạng thái OCCUPIED thành công',
        async () => {

            const req = {
                params: {
                    id: 5
                },
                body: {
                    status: 'OCCUPIED'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                status: 'AVAILABLE',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            await tableController.updateTableStatus(
                req,
                res,
                next
            );


            // Tìm được bàn bằng ID
            expect(
                RestaurantTable.findByPk
            ).toHaveBeenCalledWith(5);


            // Không cần tìm fallback
            expect(
                RestaurantTable.findOne
            ).not.toHaveBeenCalled();


            // Cập nhật trạng thái
            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                status: 'OCCUPIED'
            });


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Cập nhật trạng thái bàn thành công',
                id: 5,
                status: 'OCCUPIED'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-011
    // AVAILABLE + không có đơn chưa thanh toán
    // ========================================================

    test(
        'TB-WB-011: chuyển bàn sang AVAILABLE khi không có đơn chưa thanh toán',
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
                status: 'OCCUPIED',

                update: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            // Không có order chưa thanh toán
            Order.findOne
                .mockResolvedValue(null);


            await tableController.updateTableStatus(
                req,
                res,
                next
            );


            // Vì status = AVAILABLE
            // controller phải kiểm tra order
            expect(
                Order.findOne
            ).toHaveBeenCalled();


            // Không có order → được cập nhật
            expect(
                mockTable.update
            ).toHaveBeenCalledWith({
                status: 'AVAILABLE'
            });


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Cập nhật trạng thái bàn thành công',
                id: 5,
                status: 'AVAILABLE'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-012
    // AVAILABLE + còn đơn chưa thanh toán
    // ========================================================

    test(
        'TB-WB-012: không cho chuyển bàn sang AVAILABLE khi còn đơn chưa thanh toán',
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
                status: 'OCCUPIED',

                update: jest.fn()
            };


            const mockOrder = {
                id: 101
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            // Có order chưa thanh toán
            Order.findOne
                .mockResolvedValue(mockOrder);


            await tableController.updateTableStatus(
                req,
                res,
                next
            );


            expect(
                Order.findOne
            ).toHaveBeenCalled();


            // Không được update
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
                    "Không thể chuyển Bàn #5 về trạng thái 'Bàn trống' vì bàn này còn Đơn hàng #101 chưa thanh toán!"
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});