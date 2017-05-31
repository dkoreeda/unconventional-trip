const router = require('express').Router();
const controller = require('./controller');

// router.get('/fetchGoogleMaps/:location/:search', controller.index);
router.get('/places/:id', controller.show);
router.get('/list/:list_id/places', controller.list);
router.post('/fetchGoogleMaps', controller.fetch);
router.post('/places', controller.create);
router.put('/places', controller.update);
// router.post('/users', controller.save);
router.delete('/:place_id', controller.destroy);


module.exports = router;
