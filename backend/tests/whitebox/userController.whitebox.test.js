const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock models
jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  sequelize: {
    sync: jest.fn(),
    authenticate: jest.fn(),
  },
  connectDB: jest.fn(),
}));

const { User } = require('../../src/models');
const app = require('../../src/app');
const userController = require('../../src/controllers/userController');

describe('White-box Testing: userController (Branch, Statement, Function & Path Coverage)', () => {
  const secretKey = process.env.JWT_SECRET || 'secret_key';
  let adminToken;
  let staffToken;
  let customerToken;

  beforeAll(() => {
    adminToken = jwt.sign({ id: 1, role: 'ADMIN' }, secretKey, { expiresIn: '1h' });
    staffToken = jwt.sign({ id: 2, role: 'STAFF' }, secretKey, { expiresIn: '1h' });
    customerToken = jwt.sign({ id: 3, role: 'CUSTOMER' }, secretKey, { expiresIn: '1h' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockUserInstance = (initialData) => {
    const userInstance = {
      ...initialData,
      update: jest.fn().mockImplementation(async (updates) => {
        Object.assign(userInstance, updates);
        return userInstance;
      }),
      destroy: jest.fn().mockResolvedValue(true),
    };
    return userInstance;
  };

  // =========================================================================
  // 1. getAllUsers
  // =========================================================================
  describe('userController.getAllUsers Branches & Paths', () => {
    test('[WB-USR-GETALL-01] No filter parameters', async () => {
      User.findAll.mockResolvedValue([
        { id: 1, fullName: 'User 1', role: 'ADMIN' },
        { id: 2, fullName: 'User 2', role: 'CUSTOMER' },
      ]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          attributes: { exclude: ['password'] },
          order: [['id', 'DESC']]
        })
      );
    });

    test('[WB-USR-GETALL-02] Filter by search query', async () => {
      User.findAll.mockResolvedValue([{ id: 1, fullName: 'Nguyen Van A' }]);

      const res = await request(app)
        .get('/api/users?search=Nguyen')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({}),
        })
      );
    });

    test('[WB-USR-GETALL-03] Filter by role and status combined', async () => {
      User.findAll.mockResolvedValue([{ id: 2, role: 'STAFF', status: 'ACTIVE' }]);

      const res = await request(app)
        .get('/api/users?role=STAFF&status=ACTIVE')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(User.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ role: 'STAFF', status: 'ACTIVE' }),
        })
      );
    });

    test('[WB-USR-GETALL-04] Exception catch block (500)', async () => {
      User.findAll.mockRejectedValue(new Error('DB read failure'));

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
      expect(res.body.error).toBe('DB read failure');
    });
  });

  // =========================================================================
  // 2. getUserById
  // =========================================================================
  describe('userController.getUserById Branches & Paths', () => {
    test('[WB-USR-GETID-01] User found by ID (200)', async () => {
      User.findByPk.mockResolvedValue({ id: 5, fullName: 'Found User', role: 'CUSTOMER' });

      const res = await request(app)
        .get('/api/users/5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(5);
    });

    test('[WB-USR-GETID-02] User not found (404)', async () => {
      User.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/users/9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Không tìm thấy người dùng');
    });

    test('[WB-USR-GETID-03] Exception catch block (500)', async () => {
      User.findByPk.mockRejectedValue(new Error('DB error on findByPk'));

      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
    });
  });

  // =========================================================================
  // 3. getUserProfile
  // =========================================================================
  describe('userController.getUserProfile Branches & Paths', () => {
    test('[WB-USR-PRF-01] Profile found for logged in user (200)', async () => {
      User.findByPk.mockResolvedValue({ id: 3, fullName: 'Customer User', role: 'CUSTOMER' });

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(3);
    });

    test('[WB-USR-PRF-02] User profile not found in DB (404)', async () => {
      User.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Không tìm thấy người dùng');
    });

    test('[WB-USR-PRF-03] Exception catch block on get profile (500)', async () => {
      User.findByPk.mockRejectedValue(new Error('Profile retrieval failure'));

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
    });
  });

  // =========================================================================
  // 4. updateProfile
  // =========================================================================
  describe('userController.updateProfile Branches & Paths', () => {
    test('[WB-USR-UPPRF-01] Profile not found (404)', async () => {
      User.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ fullName: 'New Name' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Không tìm thấy người dùng');
    });

    test('[WB-USR-UPPRF-02] Partial profile update (fallback to existing properties)', async () => {
      const mockUser = createMockUserInstance({
        id: 3,
        fullName: 'Original Name',
        email: 'orig@email.com',
        phone: '0912345678',
        avatar: 'orig.png',
      });
      User.findByPk.mockResolvedValue(mockUser);

      // Send empty / partial body to test fallback: fullName || user.fullName, etc.
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({});

      expect(res.statusCode).toBe(200);
      expect(mockUser.update).toHaveBeenCalledWith({
        fullName: 'Original Name',
        email: 'orig@email.com',
        phone: '0912345678',
        avatar: 'orig.png'
      });
    });

    test('[WB-USR-UPPRF-03] Full profile update (200)', async () => {
      const mockUser = createMockUserInstance({
        id: 3,
        fullName: 'Old Name',
        email: 'old@email.com',
        phone: '0900000000',
        avatar: 'old.png'
      });
      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          fullName: 'Updated Name',
          email: 'updated@email.com',
          phone: '0911111111',
          avatar: 'updated.png'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Cập nhật hồ sơ thành công');
      expect(res.body.user.fullName).toBe('Updated Name');
    });

    test('[WB-USR-UPPRF-04] Exception catch block (500)', async () => {
      User.findByPk.mockRejectedValue(new Error('Update profile DB error'));

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ fullName: 'Crash Test' });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
    });
  });

  // =========================================================================
  // 5. createUser
  // =========================================================================
  describe('userController.createUser Branches & Paths', () => {
    test('[WB-USR-CRU-01] User already exists (400)', async () => {
      User.findOne.mockResolvedValue({ id: 9, username: 'existingAdmin' });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Test User',
          phone: '0912345678',
          username: 'existingAdmin',
          password: 'Password123@'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Tài khoản hoặc số điện thoại đã tồn tại');
    });

    test('[WB-USR-CRU-02] Create user with default role "CUSTOMER" (role not provided)', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 15,
        fullName: 'Customer Auto',
        username: 'cust_auto',
        role: 'CUSTOMER'
      });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Customer Auto',
          phone: '0912345688',
          username: 'cust_auto',
          password: 'Password123@'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Tạo người dùng thành công');
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'CUSTOMER' })
      );
    });

    test('[WB-USR-CRU-03] Create user with specified role (e.g. "STAFF")', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 16,
        fullName: 'Staff Member',
        username: 'staff_mem',
        role: 'STAFF'
      });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Staff Member',
          phone: '0912345699',
          username: 'staff_mem',
          password: 'Password123@',
          role: 'STAFF'
        });

      expect(res.statusCode).toBe(201);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'STAFF' })
      );
    });

    test('[WB-USR-CRU-04] Exception catch block (500)', async () => {
      User.findOne.mockRejectedValue(new Error('DB create crash'));

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Crash Member',
          phone: '0912345600',
          username: 'crash_mem',
          password: 'Password123@'
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
    });
  });

  // =========================================================================
  // 6. updateUser
  // =========================================================================
  describe('userController.updateUser Branches & Paths', () => {
    test('[WB-USR-UPU-01] Target user not found (404)', async () => {
      User.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/users/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ fullName: 'Does not exist' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Không tìm thấy người dùng');
    });

    test('[WB-USR-UPU-02] Self-blocking prevention: Admin attempts to set own status to INACTIVE (400)', async () => {
      const mockAdmin = createMockUserInstance({ id: 1, role: 'ADMIN', status: 'ACTIVE' });
      User.findByPk.mockResolvedValue(mockAdmin);

      const res = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'INACTIVE' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Bạn không thể tự khóa tài khoản của chính mình');
    });

    test('[WB-USR-UPU-03] ADMIN updates all fields (Branch test for all defined fields)', async () => {
      const mockUser = createMockUserInstance({ id: 10, role: 'CUSTOMER' });
      User.findByPk
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({
          id: 10,
          fullName: 'Full Admin Update',
          email: 'admin_up@test.com',
          phone: '0911223344',
          username: 'admin_up_user',
          avatar: 'new_avatar.png',
          points: 150,
          role: 'STAFF',
          status: 'BLOCKED'
        });

      const res = await request(app)
        .put('/api/users/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          fullName: 'Full Admin Update',
          email: 'admin_up@test.com',
          phone: '0911223344',
          username: 'admin_up_user',
          avatar: 'new_avatar.png',
          points: 150,
          role: 'STAFF',
          status: 'BLOCKED'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Cập nhật thành công');
      expect(mockUser.update).toHaveBeenCalledWith({
        fullName: 'Full Admin Update',
        email: 'admin_up@test.com',
        phone: '0911223344',
        username: 'admin_up_user',
        avatar: 'new_avatar.png',
        points: 150,
        role: 'STAFF',
        status: 'BLOCKED'
      });
    });

    test('[WB-USR-UPU-04] ADMIN sends empty body (all defined checks evaluate to false)', async () => {
      const mockUser = createMockUserInstance({ id: 10, role: 'CUSTOMER' });
      User.findByPk
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ id: 10 });

      const res = await request(app)
        .put('/api/users/10')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.statusCode).toBe(200);
      expect(mockUser.update).toHaveBeenCalledWith({});
    });

    test('[WB-USR-UPU-05] STAFF (Non-Admin) updates permitted fields and ignores forbidden fields', async () => {
      const mockUser = createMockUserInstance({ id: 10, role: 'CUSTOMER', status: 'ACTIVE' });
      User.findByPk
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({
          id: 10,
          points: 200,
          fullName: 'Staff Edited Name',
          phone: '0988776655',
          avatar: 'staff_avatar.png',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        });

      const res = await request(app)
        .put('/api/users/10')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          points: 200,
          fullName: 'Staff Edited Name',
          phone: '0988776655',
          avatar: 'staff_avatar.png',
          // Forbidden fields for STAFF:
          role: 'ADMIN',
          status: 'BLOCKED',
          email: 'hacker@test.com',
          username: 'hacked_username'
        });

      expect(res.statusCode).toBe(200);
      expect(mockUser.update).toHaveBeenCalledWith({
        points: 200,
        fullName: 'Staff Edited Name',
        phone: '0988776655',
        avatar: 'staff_avatar.png'
      });
    });

    test('[WB-USR-UPU-06] STAFF sends empty body (all non-admin defined checks evaluate to false)', async () => {
      const mockUser = createMockUserInstance({ id: 10, role: 'CUSTOMER' });
      User.findByPk
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ id: 10 });

      const res = await request(app)
        .put('/api/users/10')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({});

      expect(res.statusCode).toBe(200);
      expect(mockUser.update).toHaveBeenCalledWith({});
    });

    test('[WB-USR-UPU-07] Direct controller call with fallback when req.user is undefined', async () => {
      const mockUser = createMockUserInstance({ id: 10, points: 50 });
      User.findByPk
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ id: 10, points: 100 });

      const req = {
        params: { id: '10' },
        body: { points: 100, fullName: 'No User Req' },
        user: undefined // fallback test
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Cập nhật thành công' })
      );
    });

    test('[WB-USR-UPU-08] Exception catch block (500)', async () => {
      User.findByPk.mockRejectedValue(new Error('Update user DB error'));

      const res = await request(app)
        .put('/api/users/5')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ points: 50 });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
    });
  });

  // =========================================================================
  // 7. deleteUser
  // =========================================================================
  describe('userController.deleteUser Branches & Paths', () => {
    test('[WB-USR-DEL-01] Self deletion defense: Admin attempts to delete own account (400)', async () => {
      const res = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Bạn không thể tự xóa tài khoản của chính mình');
    });

    test('[WB-USR-DEL-02] Target user not found (404)', async () => {
      User.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/users/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Không tìm thấy người dùng');
    });

    test('[WB-USR-DEL-03] Successful user deletion (200)', async () => {
      const mockUser = createMockUserInstance({ id: 25, fullName: 'To Delete' });
      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app)
        .delete('/api/users/25')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Xóa người dùng thành công');
      expect(mockUser.destroy).toHaveBeenCalledTimes(1);
    });

    test('[WB-USR-DEL-04] Direct controller call with fallback when req.user is undefined', async () => {
      const mockUser = createMockUserInstance({ id: 25, fullName: 'To Delete' });
      User.findByPk.mockResolvedValue(mockUser);

      const req = {
        params: { id: '25' },
        user: undefined // fallback test
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await userController.deleteUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Xóa người dùng thành công' });
    });

    test('[WB-USR-DEL-05] Exception catch block on deleteUser (500)', async () => {
      User.findByPk.mockRejectedValue(new Error('DB delete failure'));

      const res = await request(app)
        .delete('/api/users/25')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Lỗi server');
    });
  });
});
