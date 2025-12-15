const express = require('express');
const router = express.Router();
const { processTranslation, getTranslationHistory } = require('../controllers/translateController');
const { translateLimiter } = require('../middleware/rateLimit');

router.post('/translate', translateLimiter, processTranslation);
router.get('/history', getTranslationHistory);

module.exports = router;