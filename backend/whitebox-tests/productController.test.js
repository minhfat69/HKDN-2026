const productController = require('../src/controllers/productController');
const { Product } = require('../src/models');
const { Op } = require('sequelize');

jest.mock('../src/models', () => ({
    Product: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    }
}));

describe('White-Box Testing: Product Controller (Kiểm thử Hộp trắng Module Món Ăn)', () => {
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
    });

    describe('getAllProducts (Lấy danh sách món ăn, Lọc & Tìm kiếm)', () => {
        test('[WB-PRD-01] Nhánh không truyền bộ lọc query -> where rỗng', async () => {
            const mockProducts = [
                { id: 1, name: 'Salmon Sushi', price: 50000, category_id: 1 }
            ];
            Product.findAll.mockResolvedValue(mockProducts);

            await productController.getAllProducts(req, res);

            expect(Product.findAll).toHaveBeenCalledWith({ where: {} });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        test('[WB-PRD-02] Nhánh lọc món ăn theo category_id', async () => {
            req.query.category_id = '2';
            const mockProducts = [
                { id: 2, name: 'Tuna Sashimi', price: 70000, category_id: 2 }
            ];
            Product.findAll.mockResolvedValue(mockProducts);

            await productController.getAllProducts(req, res);

            expect(Product.findAll).toHaveBeenCalledWith({
                where: { category_id: '2' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        test('[WB-PRD-03] Nhánh tìm kiếm món ăn theo từ khóa search', async () => {
            req.query.search = 'salmon';
            const mockProducts = [
                { id: 1, name: 'Salmon Sushi', price: 50000 }
            ];
            Product.findAll.mockResolvedValue(mockProducts);

            await productController.getAllProducts(req, res);

            expect(Product.findAll).toHaveBeenCalledWith({
                where: {
                    name: { [Op.like]: '%salmon%' }
                }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProducts);
        });

        test('[WB-PRD-04] Nhánh kết hợp cả category_id và search trong query', async () => {
            req.query.category_id = '1';
            req.query.search = 'maki';
            Product.findAll.mockResolvedValue([]);

            await productController.getAllProducts(req, res);

            expect(Product.findAll).toHaveBeenCalledWith({
                where: {
                    category_id: '1',
                    name: { [Op.like]: '%maki%' }
                }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        test('[WB-PRD-05] Khối catch ngoại lệ lỗi DB trong getAllProducts (500)', async () => {
            Product.findAll.mockRejectedValue(new Error('Connection error'));

            await productController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Connection error' });
        });
    });

    describe('getProductById (Lấy chi tiết món ăn theo ID)', () => {
        test('[WB-PRD-06] Nhánh tìm thấy món ăn theo ID hợp lệ (200)', async () => {
            req.params.id = 1;
            const mockProduct = { id: 1, name: 'Dragon Roll', price: 120000 };
            Product.findByPk.mockResolvedValue(mockProduct);

            await productController.getProductById(req, res);

            expect(Product.findByPk).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProduct);
        });

        test('[WB-PRD-07] Nhánh không tìm thấy món ăn (ID không tồn tại -> 404)', async () => {
            req.params.id = 999;
            Product.findByPk.mockResolvedValue(null);

            await productController.getProductById(req, res);

            expect(Product.findByPk).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
        });

        test('[WB-PRD-08] Khối catch ngoại lệ lỗi DB khi tìm theo ID (500)', async () => {
            req.params.id = 1;
            Product.findByPk.mockRejectedValue(new Error('DB failure'));

            await productController.getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'DB failure' });
        });
    });

    describe('createProduct (Tạo món ăn mới)', () => {
        test('[WB-PRD-09] Nhánh tạo món ăn thành công với dữ liệu hợp lệ (201)', async () => {
            req.body = {
                name: 'Eel Sushi',
                price: 65000,
                category_id: 1,
                image_url: 'http://example.com/eel.jpg'
            };
            const createdProduct = { id: 10, ...req.body };
            Product.create.mockResolvedValue(createdProduct);

            await productController.createProduct(req, res);

            expect(Product.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdProduct);
        });

        test('[WB-PRD-10] Khối catch lỗi validation khi thêm món ăn (400)', async () => {
            req.body = { name: '' };
            Product.create.mockRejectedValue(new Error('Validation error: price is required'));

            await productController.createProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error: price is required' });
        });
    });

    describe('updateProduct (Cập nhật thông tin món ăn)', () => {
        test('[WB-PRD-11] Nhánh cập nhật món ăn tồn tại thành công (updated = 1 -> 200)', async () => {
            req.params.id = 1;
            req.body = { price: 55000 };
            const updatedProduct = { id: 1, name: 'Salmon Sushi', price: 55000 };

            Product.update.mockResolvedValue([1]); // 1 row updated
            Product.findByPk.mockResolvedValue(updatedProduct);

            await productController.updateProduct(req, res);

            expect(Product.update).toHaveBeenCalledWith(req.body, { where: { id: 1 } });
            expect(Product.findByPk).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedProduct);
        });

        test('[WB-PRD-12] Nhánh cập nhật món ăn ID không tồn tại (updated = 0 -> 404)', async () => {
            req.params.id = 999;
            req.body = { price: 55000 };

            Product.update.mockResolvedValue([0]); // 0 rows updated

            await productController.updateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
            expect(Product.findByPk).not.toHaveBeenCalled();
        });

        test('[WB-PRD-13] Khối catch lỗi khi cập nhật món ăn (400)', async () => {
            req.params.id = 1;
            req.body = { price: -1000 };

            Product.update.mockRejectedValue(new Error('Validation error: price cannot be negative'));

            await productController.updateProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Validation error: price cannot be negative' });
        });
    });

    describe('deleteProduct (Xóa món ăn)', () => {
        test('[WB-PRD-14] Nhánh xóa món ăn tồn tại thành công (deleted = 1 -> 204)', async () => {
            req.params.id = 1;
            Product.destroy.mockResolvedValue(1); // 1 row deleted

            await productController.deleteProduct(req, res);

            expect(Product.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test('[WB-PRD-15] Nhánh xóa món ăn không tồn tại (deleted = 0 -> 404)', async () => {
            req.params.id = 999;
            Product.destroy.mockResolvedValue(0);

            await productController.deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
            expect(res.send).not.toHaveBeenCalled();
        });

        test('[WB-PRD-16] Khối catch lỗi DB khi xóa món ăn (500)', async () => {
            req.params.id = 1;
            Product.destroy.mockRejectedValue(new Error('Constraint violation'));

            await productController.deleteProduct(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Constraint violation' });
        });
    });
});
