const express = require('express');
const {
  getGoldWinners,
  getGoldWinner,
  createGoldWinner,
  updateGoldWinner,
  deleteGoldWinner
} = require('../controllers/goldWinnerController');
const { protect } = require('../middleware/auth');

const router = express.Router();


// All other routes require authentication
router.use(protect);

router.route('/')
  .get(getGoldWinners)
  .post(createGoldWinner);

router.route('/:id')
  .get(getGoldWinner)
  .put(updateGoldWinner)
  .delete(deleteGoldWinner);

module.exports = router;
