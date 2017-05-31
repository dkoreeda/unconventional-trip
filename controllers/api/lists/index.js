const router = require('express').Router();
const controller = require('./controller');

router.get('/:id', controller.index);
router.get('/:user_id/list/:list_id', controller.show);
router.post('/', controller.create);
router.post('/fetch', controller.fetchLists);
router.put('/:list_id', controller.update);
router.delete('/:list_id', controller.destroy);

module.exports = router;
