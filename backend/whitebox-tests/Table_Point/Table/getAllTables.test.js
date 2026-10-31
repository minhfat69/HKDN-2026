const {
    RestaurantTable,
    Reservation,
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
// GET ALL TABLES
// ============================================================

describe('Table Controller - getAllTables', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-WB-022
    // Không có active order / reservation
    // ========================================================

    test(
        'TB-WB-022: lấy danh sách bàn và giữ nguyên trạng thái khi không có order hoặc reservation',
        async () => {

            const req = {};

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE',

                toJSON: jest.fn().mockReturnValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE'
                })
            };


            RestaurantTable.findAll
                .mockResolvedValue([
                    mockTable
                ]);


            // Không có active order
            Order.findOne
                .mockResolvedValue(null);


            // Không có active reservation
            Reservation.findOne
                .mockResolvedValue(null);


            await tableController.getAllTables(
                req,
                res,
                next
            );


            expect(
                RestaurantTable.findAll
            ).toHaveBeenCalledWith({
                order: [
                    ['tableNumber', 'ASC'],
                    ['id', 'ASC']
                ]
            });


            expect(
                mockTable.toJSON
            ).toHaveBeenCalledTimes(1);


            expect(
                res.json
            ).toHaveBeenCalledWith([
                {
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'AVAILABLE',
                    calculatedStatus: 'AVAILABLE'
                }
            ]);


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-007
    // activeOrder = 59 phút
    // ========================================================

    test(
        'TB-BVA-007: activeOrder sử dụng 59 phút hiển thị theo phút',
        async () => {

            const req = {};

            const res = createMockResponse();
            const next = createMockNext();


            const now = new Date();

            const occupiedSince = new Date(
                now.getTime() - 59 * 60 * 1000
            );


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                toJSON: jest.fn().mockReturnValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'OCCUPIED'
                })
            };


            const mockOrder = {
                createdAt: occupiedSince
            };


            RestaurantTable.findAll
                .mockResolvedValue([
                    mockTable
                ]);


            Order.findOne
                .mockResolvedValue(mockOrder);


            await tableController.getAllTables(
                req,
                res,
                next
            );


            const result =
                res.json.mock.calls[0][0][0];


            expect(
                result.timeUsed
            ).toBe('59p');


            expect(
                result.timeUsed
            ).not.toContain('h');


            expect(
                result.calculatedStatus
            ).toBe('OCCUPIED');


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-BVA-008
    // activeOrder = 60 phút
    // ========================================================

    test(
        'TB-BVA-008: activeOrder sử dụng 60 phút chuyển sang hiển thị theo giờ',
        async () => {

            const req = {};

            const res = createMockResponse();
            const next = createMockNext();


            const now = new Date();

            const occupiedSince = new Date(
                now.getTime() - 60 * 60 * 1000
            );


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                toJSON: jest.fn().mockReturnValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'OCCUPIED'
                })
            };


            const mockOrder = {
                createdAt: occupiedSince
            };


            RestaurantTable.findAll
                .mockResolvedValue([
                    mockTable
                ]);


            Order.findOne
                .mockResolvedValue(mockOrder);


            await tableController.getAllTables(
                req,
                res,
                next
            );


            const result =
                res.json.mock.calls[0][0][0];


            expect(
                result.timeUsed
            ).toBe('1h 0p');


            expect(
                result.timeUsedMins
            ).toBe(60);


            expect(
                result.calculatedStatus
            ).toBe('OCCUPIED');


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-023
    // OCCUPIED + CHECKED_IN
    // ========================================================

    test(
        'TB-WB-023: bàn OCCUPIED không có order nhưng có reservation CHECKED_IN',
        async () => {

            const req = {};

            const res = createMockResponse();
            const next = createMockNext();


            const now = new Date();

            const checkInTime = new Date(
                now.getTime() - 30 * 60 * 1000
            );


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'OCCUPIED',

                toJSON: jest.fn().mockReturnValue({
                    id: 5,
                    tableNumber: 5,
                    capacity: 4,
                    qrCode: 'T5',
                    status: 'OCCUPIED'
                })
            };


            const mockCheckInReservation = {
                updated_at: checkInTime,
                numberOfGuests: 3
            };


            RestaurantTable.findAll
                .mockResolvedValue([
                    mockTable
                ]);


            // Không có active order
            Order.findOne
                .mockResolvedValue(null);


            /*
             * Reservation.findOne được gọi 2 lần:
             *
             * Lần 1:
             * CHECKED_IN reservation
             *
             * Lần 2:
             * active CONFIRMED reservation
             */
            Reservation.findOne
                .mockResolvedValueOnce(
                    mockCheckInReservation
                )
                .mockResolvedValueOnce(null);


            await tableController.getAllTables(
                req,
                res,
                next
            );


            const result =
                res.json.mock.calls[0][0][0];


            expect(
                result.timeUsedMins
            ).toBe(30);


            expect(
                result.timeUsed
            ).toBe('30p');


            expect(
                result.guestCount
            ).toBe(3);


            expect(
                result.occupiedSince
            ).toEqual(checkInTime);


            expect(
                result.calculatedStatus
            ).toBe('OCCUPIED');


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-024
    // OCCUPIED + không có CHECKED_IN
    // ========================================================

    test(
        'TB-WB-024: bàn OCCUPIED không có order và không có CHECKED_IN reservation',
        async () => {

            const req = {};

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 6,
                tableNumber: 6,
                capacity: 4,
                qrCode: 'T6',
                status: 'OCCUPIED',

                toJSON: jest.fn().mockReturnValue({
                    id: 6,
                    tableNumber: 6,
                    capacity: 4,
                    qrCode: 'T6',
                    status: 'OCCUPIED'
                })
            };


            RestaurantTable.findAll
                .mockResolvedValue([
                    mockTable
                ]);


            // Không có active order
            Order.findOne
                .mockResolvedValue(null);


            // Không có CHECKED_IN
            // và không có CONFIRMED reservation
            Reservation.findOne
                .mockResolvedValue(null);


            await tableController.getAllTables(
                req,
                res,
                next
            );


            const result =
                res.json.mock.calls[0][0][0];


            expect(
                result.timeUsed
            ).toBeUndefined();


            expect(
                result.timeUsedMins
            ).toBeUndefined();


            expect(
                result.guestCount
            ).toBeUndefined();


            // OCCUPIED phải được ưu tiên
            expect(
                result.calculatedStatus
            ).toBe('OCCUPIED');


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});