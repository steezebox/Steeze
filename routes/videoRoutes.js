const express = require('express');
const router = express.Router();
const { uploadVideo, unlockVideo } = require('../controllers/videoController');

router.post('/upload', uploadVideo);
router.post('/unlock', unlockVideo);

module.exports = router;

