const {
    RestaurantTable
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
// BULK CREATE TABLES
// ============================================================

describe('Table Controller - bulkCreateTables', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-WB-019
    // Body không phải Array
    // ========================================================

    test(
        'TB-WB-019: dữ liệu gửi lên không phải mảng trả về 400',
        async () => {

            const req = {
                body: {
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            await tableController.bulkCreateTables(
                req,
                res,
                next
            );


            // Không được gọi bulkCreate
            expect(
                RestaurantTable.bulkCreate
            ).not.toHaveBeenCalled();


            // Dữ liệu không phải mảng → 400
            expect(
                res.status
            ).toHaveBeenCalledWith(400);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Dữ liệu gửi lên phải là một mảng'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-020
    // Body là Array
    // ========================================================

    test(
        'TB-WB-020: tạo nhiều bàn thành công khi dữ liệu là mảng',
        async () => {

            const req = {
                body: [
                    {
                        tableNumber: 5,
                        capacity: 4,
                        qrCode: 'T5',
                        status: 'AVAILABLE'
                    },
                    {
                        tableNumber: 6,
                        capacity: 6,
                        qrCode: 'T6',
                        status: 'AVAILABLE'
                    }
                ]
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockResults = [
                {
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                },
                {
                    id: 6,
                    tableNumber: 6,
                    capacity: 6,
                    qrCode: 'T6',
                    status: 'AVAILABLE'
                }
            ];


            RestaurantTable.bulkCreate
                .mockResolvedValue(mockResults);


            await tableController.bulkCreateTables(
                req,
                res,
                next
            );


            // Kiểm tra bulkCreate nhận đúng dữ liệu
            expect(
                RestaurantTable.bulkCreate
            ).toHaveBeenCalledWith(
                req.body,
                {
                    updateOnDuplicate: [
                        'capacity',
                        'qrCode',
                        'status'
                    ]
                }
            );


            // Thành công → 201
            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Đã xử lý thành công 2 bàn trong hệ thống',
                data: mockResults
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-021
    // bulkCreate xảy ra lỗi
    // ========================================================

    test(
        'TB-WB-021: bulkCreate xảy ra lỗi trả về 500',
        async () => {

            const req = {
                body: [
                    {
                        tableNumber: 5,
                        capacity: 4,
                        qrCode: 'T5',
                        status: 'AVAILABLE'
                    }
                ]
            };

            const res = createMockResponse();
            const next = createMockNext();


            const databaseError =
                new Error('Database error');


            RestaurantTable.bulkCreate
                .mockRejectedValue(databaseError);


            await tableController.bulkCreateTables(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.bulkCreate
            ).toHaveBeenCalled();


            // Lỗi database → 500
            expect(
                res.status
            ).toHaveBeenCalledWith(500);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Lỗi khi nạp dữ liệu bàn',
                error:
                    'Database error'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});