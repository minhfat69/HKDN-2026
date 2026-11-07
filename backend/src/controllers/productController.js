const jwt = require("jsonwebtoken");
const { Product } = require("../models");
const { Op } = require("sequelize");
require("dotenv").config();


exports.getAllProducts = async (req, res) => {
  try {
    const { category_id, search, available } = req.query;
    const where = {};
    if (category_id) {
      where.category_id = category_id;
    }
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    // ?available=true: chỉ trả món đang phục vụ (dùng cho menu QR/Web của khách)
    if (available === 'true') where.isAvailable = true;
    const products = await Product.findAll({ where });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updatedProduct = await Product.findByPk(req.params.id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Bật/tắt phục vụ một món (báo hết món khẩn cấp). Bếp, phục vụ, admin được dùng.
exports.setAvailability = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const { isAvailable } = req.body;
    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ message: "isAvailable phải là true hoặc false" });
    }
    const fields = { isAvailable };
    // Bật lại món đang có stock = 0 thì cần có suất để khách đặt được
    if (isAvailable && product.stock === 0) {
      const restock = parseInt(req.body.stock);
      if (!restock || restock < 1) {
        return res.status(400).json({ message: "Món đang hết kho, cần nhập số suất (stock) khi bật lại" });
      }
      fields.stock = restock;
    }
    await product.update(fields);
    res.status(200).json({ message: isAvailable ? "Đã mở bán lại món" : "Đã báo hết món", data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
