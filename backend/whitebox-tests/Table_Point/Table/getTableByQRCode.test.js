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
// GET TABLE BY QR CODE
// ============================================================

describe('Table Controller - getTableByQRCode', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // ========================================================
    // TB-WB-017
    // QR Code không tồn tại
    // ========================================================

    test(
        'TB-WB-017: không tìm thấy bàn với mã QR trả về 404',
        async () => {

            const req = {
                params: {
                    qrCode: 'T999'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            RestaurantTable.findOne
                .mockResolvedValue(null);


            await tableController.getTableByQRCode(
                req,
                res,
                next
            );


            // Kiểm tra tìm kiếm đúng QR
            expect(
                RestaurantTable.findOne
            ).toHaveBeenCalledWith({
                where: {
                    qrCode: 'T999'
                }
            });


            // Không tìm thấy → 404
            expect(
                res.status
            ).toHaveBeenCalledWith(404);


            expect(
                res.json
            ).toHaveBeenCalledWith({
                message:
                    'Không tìm thấy bàn với mã QR này'
            });


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );


    // ========================================================
    // TB-WB-018
    // QR Code tồn tại
    // ========================================================

    test(
        'TB-WB-018: tìm thấy bàn bằng mã QR trả về thông tin bàn',
        async () => {

            const req = {
                params: {
                    qrCode: 'T5'
                }
            };

            const res = createMockResponse();
            const next = createMockNext();


            const mockTable = {
                id: 5,
                tableNumber: 5,
                capacity: 4,
                qrCode: 'T5',
                status: 'AVAILABLE'
            };


            RestaurantTable.findOne
                .mockResolvedValue(mockTable);


            await tableController.getTableByQRCode(
                req,
                res,
                next
            );


            // Kiểm tra tìm kiếm đúng QR
            expect(
                RestaurantTable.findOne
            ).toHaveBeenCalledWith({
                where: {
                    qrCode: 'T5'
                }
            });


            // Tìm thấy → trả về bàn
            expect(
                res.json
            ).toHaveBeenCalledWith(
                mockTable
            );


            // Không được trả lỗi
            expect(
                res.status
            ).not.toHaveBeenCalled();


            expect(
                next
            ).not.toHaveBeenCalled();

        }
    );

});