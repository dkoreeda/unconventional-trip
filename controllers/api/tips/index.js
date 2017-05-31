const router = require('express').Router();
const controller = require('./controller');

router.get('/sharedlist', controller.showSharedLists);
router.get('/list/:list_id', controller.fetchList);
router.get('/:id', controller.index);
router.post('/', controller.share);
router.post('/find_lists', controller.findLists);

module.exports = router;
