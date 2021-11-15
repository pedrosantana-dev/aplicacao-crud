const express = require('express');
const router = express.Router();
const controller = require('../controllers/departementController');

router.post('/', controller.post);
router.get('/', controller.get);
router.delete('/:id', controller.delete);
router.patch('/:id', controller.patch);

module.exports = router;