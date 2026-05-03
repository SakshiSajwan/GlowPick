const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getRecommendations } = require('../controllers/recommendationController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('selfie'), getRecommendations);

module.exports = router;