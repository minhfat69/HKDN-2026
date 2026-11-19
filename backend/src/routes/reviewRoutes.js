const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Lấy danh sách đánh giá
router.get('/', reviewController.getAllReviews);

// Gửi đánh giá mới
router.post('/', reviewController.createReview);

// Nhà hàng phản hồi (reply) đánh giá (hỗ trợ cả PUT và POST)
router.put('/:id/reply', reviewController.replyReview);
router.post('/:id/reply', reviewController.replyReview);

// Ẩn / Hiện đánh giá (kiểm duyệt UC33)
router.put('/:id/status', reviewController.updateReviewStatus);
router.post('/:id/status', reviewController.updateReviewStatus);

// Admin xóa đánh giá
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
