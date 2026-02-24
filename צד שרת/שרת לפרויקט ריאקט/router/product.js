const express = require('express');
const router = express.Router();
const controllerProduct = require('../controller/product')
const { getAllProducts } = require('../controller/product');


router.get('/products', getAllProducts);
router.get("/", controllerProduct.get);
router.get("/:id", controllerProduct.getById);
router.post("/", controllerProduct.post);
router.delete("/:id", controllerProduct.delete);
router.put("/:id", controllerProduct.update);

module.exports = router;