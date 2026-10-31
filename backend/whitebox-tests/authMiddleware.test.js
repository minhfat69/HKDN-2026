const jwt = require('jsonwebtoken');
const { verifyToken, optionalVerifyToken, isAdmin, isStaffOrAdmin } = require('../src/middlewares/authMiddleware');

jest.mock('jsonwebtoken');

describe('White-Box Testing: Auth Middleware (Kiểm thử Hộp trắng Middleware Bảo vệ Phân quyền)', () => {
    let req, res, next;
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('verifyToken (Bắt buộc xác thực Token)', () => {
        test('[WB-AUTH-01] Nhánh thiếu Authorization header -> trả về 401 "No token"', () => {
            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'No token' });
            expect(next).not.toHaveBeenCalled();
        });

        test('[WB-AUTH-02] Nhánh Token hợp lệ với biến JWT_SECRET cấu hình', () => {
            process.env.JWT_SECRET = 'my_custom_secret';
            req.headers.authorization = 'Bearer valid_token_string';
            const decodedUser = { id: 1, role: 'ADMIN' };
            jwt.verify.mockReturnValue(decodedUser);

            verifyToken(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token_string', 'my_custom_secret');
            expect(req.user).toEqual(decodedUser);
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-03] Nhánh Token hợp lệ với secret mặc định khi JWT_SECRET unset', () => {
            delete process.env.JWT_SECRET;
            req.headers.authorization = 'Bearer valid_token_fallback';
            const decodedUser = { id: 1, role: 'ADMIN' };
            jwt.verify.mockReturnValue(decodedUser);

            verifyToken(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token_fallback', 'secret_key');
            expect(req.user).toEqual(decodedUser);
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-04] Khối catch ngoại lệ khi Token không hợp lệ / hết hạn (401)', () => {
            req.headers.authorization = 'Bearer invalid_token';
            jwt.verify.mockImplementation(() => {
                throw new Error('TokenExpiredError');
            });

            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('optionalVerifyToken (Tùy chọn xác thực)', () => {
        test('[WB-AUTH-05] Nhánh không có header -> gán req.user = null, gọi next()', () => {
            optionalVerifyToken(req, res, next);

            expect(req.user).toBeNull();
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-06] Nhánh Token hợp lệ với JWT_SECRET cấu hình', () => {
            process.env.JWT_SECRET = 'custom_jwt_secret';
            req.headers.authorization = 'Bearer valid_token';
            const decodedUser = { id: 2, role: 'CUSTOMER' };
            jwt.verify.mockReturnValue(decodedUser);

            optionalVerifyToken(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'custom_jwt_secret');
            expect(req.user).toEqual(decodedUser);
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-07] Nhánh Token hợp lệ với secret fallback', () => {
            delete process.env.JWT_SECRET;
            req.headers.authorization = 'Bearer valid_token';
            const decodedUser = { id: 2, role: 'CUSTOMER' };
            jwt.verify.mockReturnValue(decodedUser);

            optionalVerifyToken(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'secret_key');
            expect(req.user).toEqual(decodedUser);
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-08] Khối catch khi Token sai định dạng (vẫn tiếp tục với req.user = null)', () => {
            req.headers.authorization = 'Bearer corrupted_token';
            jwt.verify.mockImplementation(() => {
                throw new Error('JsonWebTokenError');
            });

            optionalVerifyToken(req, res, next);

            expect(req.user).toBeNull();
            expect(next).toHaveBeenCalled();
        });
    });

    describe('isAdmin (Kiểm tra quyền Admin)', () => {
        test('[WB-AUTH-09] Nhánh user có role ADMIN (viết hoa)', () => {
            req.user = { id: 1, role: 'ADMIN' };

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        test('[WB-AUTH-10] Nhánh user có role admin (viết thường)', () => {
            req.user = { id: 1, role: 'admin' };

            isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-11] Nhánh user role CUSTOMER -> từ chối 403 Forbidden', () => {
            req.user = { id: 2, role: 'CUSTOMER' };

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
            expect(next).not.toHaveBeenCalled();
        });

        test('[WB-AUTH-12] Nhánh user không có trường role -> từ chối 403 Forbidden', () => {
            req.user = { id: 3 };

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
        });

        test('[WB-AUTH-13] Nhánh req.user là undefined / null -> từ chối 403 Forbidden', () => {
            req.user = undefined;

            isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Admin only.' });
        });
    });

    describe('isStaffOrAdmin (Kiểm tra quyền Nhân viên hoặc Admin)', () => {
        test('[WB-AUTH-14] Nhánh role là ADMIN -> cho phép next()', () => {
            req.user = { role: 'ADMIN' };
            isStaffOrAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-15] Nhánh role là STAFF -> cho phép next()', () => {
            req.user = { role: 'staff' };
            isStaffOrAdmin(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        test('[WB-AUTH-16] Nhánh role là CUSTOMER -> từ chối 403', () => {
            req.user = { role: 'CUSTOMER' };
            isStaffOrAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Staff or Admin only.' });
        });

        test('[WB-AUTH-17] Nhánh req.user là undefined -> từ chối 403', () => {
            req.user = undefined;
            isStaffOrAdmin(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. Staff or Admin only.' });
        });
    });
});
