const express = require('express');
const router = express.Router();
const operationsController = require('../controllers/operationsController');
const { optionalVerifyToken } = require('../middlewares/authMiddleware');

router.post('/discount/preview', operationsController.previewDiscount);
router.get('/vouchers', operationsController.getAllVouchers);
router.post('/vouchers', operationsController.createVoucher);

router.post('/delivery/order', optionalVerifyToken, operationsController.createDeliveryOrder);

router.post('/orders/:id/void-waste', operationsController.voidOrWasteOrder);
router.get('/shifts/current', operationsController.getCurrentShift);
router.post('/shifts/open', optionalVerifyToken, operationsController.openShift);
router.post('/shifts/close', optionalVerifyToken, operationsController.closeShift);

router.get('/inventory', operationsController.getInventory);
router.post('/inventory/import-barcode', operationsController.importStockByBarcode);
router.get('/recipes', operationsController.getRecipes);
router.post('/recipes', operationsController.saveRecipe);
router.get('/analytics/pnl', operationsController.getPnLAndForecast);

module.exports = router;
