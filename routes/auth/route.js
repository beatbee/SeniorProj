const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.post('/', auth.postgpsdata);
router.post('/worker', auth.postgpsdata);
module.exports = router;