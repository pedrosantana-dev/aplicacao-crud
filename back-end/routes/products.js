const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.create);
router.get('/', productController.read);
router.patch('/:id', productController.update);
router.delete('/:id', productController.delete);


module.exports = router;