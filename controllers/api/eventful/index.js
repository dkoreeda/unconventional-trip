const router = require('express').Router();
const controller = require('./controller');

// router.get('/schedule/:date', controller.show);
router.get('/schedule', controller.show);

module.exports = router;
