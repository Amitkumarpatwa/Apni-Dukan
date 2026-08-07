const express = require("express");
const Product = require("./product.model");
const ProductRepository = require("./product.repository");
const ProductService = require("./product.service");
const ProductController = require("./product.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const upload = require("../../middleware/upload.middleware");

const router = express.Router();

// Dependency injection keeps each layer decoupled.
const productRepository = new ProductRepository(Product);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", authMiddleware, upload.array("images", 8), productController.create);
router.put("/:id", authMiddleware, upload.array("images", 8), productController.update);
router.delete("/:id", authMiddleware, productController.delete);

router.get("/:id/reviews", productController.getReviews);
router.post("/:id/reviews", productController.addReview);

module.exports = router;
