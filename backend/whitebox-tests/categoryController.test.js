const categoryController = require('../src/controllers/categoryController');
const { Category, Product } = require('../src/models');
const { Op } = require('sequelize');

jest.mock('../src/models', () => ({
    Category: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    },
    Product: {}
}));

describe('White-Box Testing: Category Controller (Kiểm thử Hộp trắng Module Danh Mục)', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {},
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    describe('getAllCategories (Lấy danh sách danh mục & Tìm kiếm)', () => {
        test('[WB-CAT-01] Nhánh không có search query & danh mục có kèm sản phẩm', async () => {
            const mockCategories = [
                {
                    toJSON: () => ({ id: 1, name: 'Sushi', products: [{ id: 101 }, { id: 102 }] })
                },
                {
                    toJSON: () => ({ id: 2, name: 'Drink', products: null }) // Branch: products is falsy
                }
            ];

            Category.findAll.mockResolvedValue(mockCategories);

            await categoryController.getAllCategories(req, res);

            expect(Category.findAll).toHaveBeenCalledWith({
                where: {},
                include: [{
                    model: Product,
                    as: 'products',
                    attributes: ['id']
                }]
            });
            expect(res.json).toHaveBeenCalledWith([
                { id: 1, name: 'Sushi', productCount: 2 },
                { id: 2, name: 'Drink', productCount: 0 }
            ]);
        });

        test('[WB-CAT-02] Nhánh không có search query & danh mục không có sản phẩm', async () => {
            const mockCategories = [
                {
                    toJSON: () => ({ id: 2, name: 'Drink', products: null })
                }
            ];

            Category.findAll.mockResolvedValue(mockCategories);

            await categoryController.getAllCategories(req, res);

            expect(res.json).toHaveBeenCalledWith([
                { id: 2, name: 'Drink', productCount: 0 }
            ]);
        });

        test('[WB-CAT-03] Nhánh có từ khóa search (Query Op.or name và description)', async () => {
            req.query.search = 'sashimi';

            Category.findAll.mockResolvedValue([
                {
                    toJSON: () => ({ id: 3, name: 'Sashimi', products: [{ id: 201 }] })
                }
            ]);

            await categoryController.getAllCategories(req, res);

            expect(Category.findAll).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: '%sashimi%' } },
                        { description: { [Op.like]: '%sashimi%' } }
                    ]
                }
            }));
            expect(res.json).toHaveBeenCalledWith([
                { id: 3, name: 'Sashimi', productCount: 1 }
            ]);
        });

        test('[WB-CAT-04] Khối catch ngoại lệ khi Database lỗi trong getAllCategories', async () => {
            Category.findAll.mockRejectedValue(new Error('Database query failed'));

            await categoryController.getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database query failed' });
        });
    });

    describe('getCategoryById (Lấy chi tiết danh mục theo ID)', () => {
        test('[WB-CAT-05] Nhánh tìm thấy danh mục theo ID hợp lệ', async () => {
            req.params.id = 1;
            const mockCategory = { id: 1, name: 'Nigiri', description: 'Fresh nigiri' };
            Category.findByPk.mockResolvedValue(mockCategory);

            await categoryController.getCategoryById(req, res);

            expect(Category.findByPk).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockCategory);
        });

        test('[WB-CAT-06] Nhánh không tìm thấy danh mục (ID không tồn tại -> 404)', async () => {
            req.params.id = 999;
            Category.findByPk.mockResolvedValue(null);

            await categoryController.getCategoryById(req, res);

            expect(Category.findByPk).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
        });

        test('[WB-CAT-07] Khối catch ngoại lệ lỗi DB khi tìm theo ID', async () => {
            req.params.id = 1;
            Category.findByPk.mockRejectedValue(new Error('Connection lost'));

            await categoryController.getCategoryById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Connection lost' });
        });
    });

    describe('createCategory (Tạo mới danh mục)', () => {
        test('[WB-CAT-08] Nhánh tạo danh mục thành công với dữ liệu hợp lệ (201)', async () => {
            req.body = { name: 'Dessert', description: 'Sweet treats' };
            const createdData = { id: 5, ...req.body };
            Category.create.mockResolvedValue(createdData);

            await categoryController.createCategory(req, res);

            expect(Category.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdData);
        });

        test('[WB-CAT-09] Khối catch lỗi validation khi tạo danh mục (400)', async () => {
            req.body = {};
            Category.create.mockRejectedValue(new Error('Validation error: name cannot be null'));

            await categoryController.createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error: name cannot be null' });
        });
    });

    describe('updateCategory (Cập nhật danh mục)', () => {
        test('[WB-CAT-10] Nhánh cập nhật danh mục tồn tại thành công (updated = 1)', async () => {
            req.params.id = 1;
            req.body = { name: 'Sushi Rolls' };
            const updatedData = { id: 1, name: 'Sushi Rolls', description: 'Updated' };

            Category.update.mockResolvedValue([1]); // 1 row affected
            Category.findByPk.mockResolvedValue(updatedData);

            await categoryController.updateCategory(req, res);

            expect(Category.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
            expect(Category.findByPk).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(updatedData);
        });

        test('[WB-CAT-11] Nhánh cập nhật ID không tồn tại (updated = 0 -> 404)', async () => {
            req.params.id = 999;
            req.body = { name: 'Unknown' };

            Category.update.mockResolvedValue([0]); // 0 rows affected

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
            expect(Category.findByPk).not.toHaveBeenCalled();
        });

        test('[WB-CAT-12] Khối catch lỗi khi cập nhật danh mục (400)', async () => {
            req.params.id = 1;
            req.body = { name: '' };

            Category.update.mockRejectedValue(new Error('Validation error'));

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
        });
    });

    describe('deleteCategory (Xóa danh mục)', () => {
        test('[WB-CAT-13] Nhánh xóa danh mục tồn tại thành công (deleted = 1 -> 204)', async () => {
            req.params.id = 1;
            Category.destroy.mockResolvedValue(1); // 1 row deleted

            await categoryController.deleteCategory(req, res);

            expect(Category.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test('[WB-CAT-14] Nhánh xóa danh mục không tồn tại (deleted = 0 -> 404)', async () => {
            req.params.id = 999;
            Category.destroy.mockResolvedValue(0);

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
            expect(res.send).not.toHaveBeenCalled();
        });

        test('[WB-CAT-15] Khối catch lỗi cơ sở dữ liệu khi xóa danh mục (500)', async () => {
            req.params.id = 1;
            Category.destroy.mockRejectedValue(new Error('Foreign key constraint error'));

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Foreign key constraint error' });
        });
    });
});
