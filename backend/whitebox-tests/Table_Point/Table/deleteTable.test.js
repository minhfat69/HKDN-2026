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
// DELETE TABLE
// ============================================================

describe('Table Controller - deleteTable', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-WB-013
    // Không tìm thấy bàn
    // ========================================================

    test(
        'TB-WB-013: xóa bàn không tồn tại trả về 404',
        async () => {

            const req = {
                params: {
                    id: 999
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


            await tableController.deleteTable(
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
                message:
                    'Không tìm thấy bàn ăn với mã này trong hệ thống'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-014
    // Có đơn chưa hoàn tất
    // ========================================================

    test(
        'TB-WB-014: không cho xóa bàn đang có đơn chưa hoàn tất',
        async () => {

            const req = {
                params: {
                    id: 5
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,

                destroy: jest.fn()
            };


            const mockOrder = {
                id: 100
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            // Có active order
            Order.findOne
                .mockResolvedValue(mockOrder);


            await tableController.deleteTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findByPk
            ).toHaveBeenCalledWith(5);


            expect(
                Order.findOne
            ).toHaveBeenCalled();


            // Không được xóa
            expect(
                mockTable.destroy
            ).not.toHaveBeenCalled();


            expect(
                res.status
            ).toHaveBeenCalledWith(400);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Không thể xóa Bàn #5 đang có đơn hàng #100 chưa hoàn tất!'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-015
    // Không có đơn chưa hoàn tất
    // ========================================================

    test(
        'TB-WB-015: xóa bàn thành công khi không có đơn chưa hoàn tất',
        async () => {

            const req = {
                params: {
                    id: 5
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,

                destroy: jest.fn()
            };


            RestaurantTable.findByPk
                .mockResolvedValue(mockTable);


            // Không có active order
            Order.findOne
                .mockResolvedValue(null);


            await tableController.deleteTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findByPk
            ).toHaveBeenCalledWith(5);


            expect(
                Order.findOne
            ).toHaveBeenCalled();


            expect(
                mockTable.destroy
            ).toHaveBeenCalledTimes(1);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Xóa bàn ăn #5 thành công',
                id: 5
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-016
    // findByPk không tìm thấy
    // nhưng findOne tìm thấy
    // ========================================================

    test(
        'TB-WB-016: xóa bàn khi findByPk không tìm thấy nhưng findOne tìm thấy',
        async () => {

            const req = {
                params: {
                    id: 5
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,

                destroy: jest.fn()
            };


            // findByPk không tìm thấy
            RestaurantTable.findByPk
                .mockResolvedValue(null);


            // Fallback findOne tìm thấy
            RestaurantTable.findOne
                .mockResolvedValue(mockTable);


            // Không có active order
            Order.findOne
                .mockResolvedValue(null);


            await tableController.deleteTable(
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
                Order.findOne
            ).toHaveBeenCalled();


            expect(
                mockTable.destroy
            ).toHaveBeenCalledTimes(1);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Xóa bàn ăn #5 thành công',
                id: 5
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});