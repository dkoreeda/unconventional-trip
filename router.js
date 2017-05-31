const router = require('express').Router();

router.use('/lists', require('./controllers/api/lists'));
router.use('/users', require('./controllers/api/users'));
router.use('/tips', require('./controllers/api/tips'));
router.use('/maps', require('./controllers/api/maps'));
router.use('/eventful', require('./controllers/api/eventful'));

router.get('/', (req, res) => res.render('index'));

module.exports = router;
