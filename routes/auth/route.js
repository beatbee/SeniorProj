const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.post('/', auth.authUser);
router.post('/worker', auth.authWorker);
module.exports = router;