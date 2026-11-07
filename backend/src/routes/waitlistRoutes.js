const express = require('express');
const router = express.Router();
const waitlist = require('../controllers/waitlistController');
const { verifyToken, isHostOrStaffOrAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken, isHostOrStaffOrAdmin);
router.get('/', waitlist.listEntries);
router.post('/', waitlist.createEntry);
router.put('/:id/notify', waitlist.notifyEntry);
router.put('/:id/seat', waitlist.seatEntry);
router.put('/:id/status', waitlist.updateStatus);

module.exports = router;
