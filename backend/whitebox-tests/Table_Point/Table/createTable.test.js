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
// CREATE TABLE
// ============================================================

describe('Table Controller - createTable', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-001
    // ========================================================

    test(
        'TB-001: tạo bàn thành công khi bàn chưa tồn tại',
        async () => {

            const req = {
                body: {
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue(null);


            RestaurantTable.create
                .mockResolvedValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                });


            await tableController.createTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findOne
            ).toHaveBeenCalledWith({
                where: {
                    tableNumber: 5
                }
            });


            expect(
                RestaurantTable.create
            ).toHaveBeenCalledWith({
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE'
            });


            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message: 'Tạo bàn mới thành công',
                table: {
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                }
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-002
    // ========================================================

    test(
        'TB-002: không cho tạo bàn khi bàn đã tồn tại',
        async () => {

            const req = {
                body: {
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                });


            await tableController.createTable(
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
                    'Bàn #5 đã tồn tại trong hệ thống!'
            });


            expect(
                RestaurantTable.create
            ).not.toHaveBeenCalled();


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-001
    // tableNumber = 0
    // ========================================================

    test(
        'TB-BVA-001: tableNumber = 0 sử dụng giá trị mặc định 1',
        async () => {

            const req = {
                body: {
                    tableNumber: 0,
                    capacity: 4,
                    qrCode: 'T0',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue(null);


            RestaurantTable.create
                .mockResolvedValue({
                    id: 1,
                    tableNumber: 1,
                    capacity: 4,
                    qrCode: 'T0',
                    status: 'AVAILABLE'
                });


            await tableController.createTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findOne
            ).toHaveBeenCalledWith({
                where: {
                    tableNumber: 1
                }
            });


            expect(
                RestaurantTable.create
            ).toHaveBeenCalledWith({
                tableNumber: 1,
                capacity: 4,
                qrCode: 'T0',
                status: 'AVAILABLE'
            });


            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-002
    // capacity = 0
    // ========================================================

    test(
        'TB-BVA-002: capacity = 0 sử dụng giá trị mặc định 4',
        async () => {

            const req = {
                body: {
                    tableNumber: 5,
                    capacity: 0,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue(null);


            RestaurantTable.create
                .mockResolvedValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                });


            await tableController.createTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.create
            ).toHaveBeenCalledWith({
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE'
            });


            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-003
    // qrCode rỗng
    // ========================================================

    test(
        'TB-BVA-003: qrCode rỗng sử dụng QR mặc định theo số bàn',
        async () => {

            const req = {
                body: {
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: '',
                    status: 'AVAILABLE'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue(null);


            RestaurantTable.create
                .mockResolvedValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                });


            await tableController.createTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.create
            ).toHaveBeenCalledWith({
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE'
            });


            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-004
    // status không được cung cấp
    // ========================================================

    test(
        'TB-BVA-004: status không được cung cấp sử dụng giá trị mặc định AVAILABLE',
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


            RestaurantTable.findOne
                .mockResolvedValue(null);


            RestaurantTable.create
                .mockResolvedValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                });


            await tableController.createTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.create
            ).toHaveBeenCalledWith({
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE'
            });


            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-003
    // ========================================================

    test(
        'TB-WB-003: giữ nguyên status OCCUPIED khi tạo bàn',
        async () => {

            const req = {
                body: {
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'OCCUPIED'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue(null);


            RestaurantTable.create
                .mockResolvedValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'OCCUPIED'
                });


            await tableController.createTable(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.create
            ).toHaveBeenCalledWith({
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED'
            });


            expect(
                res.status
            ).toHaveBeenCalledWith(201);


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});