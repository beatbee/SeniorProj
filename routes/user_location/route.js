const express = require('express');
const router = express.Router();
const location = require('./user_location');

router.get('/', (req, res) => {
    res.send('Hello World this is location');
});
router.post('/', location.postgpsdata);

module.exports = router;