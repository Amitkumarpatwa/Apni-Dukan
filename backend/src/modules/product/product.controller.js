const { successResponse } = require("../../utils/apiResponse");
const { createProductSchema, queryProductSchema, updateProductSchema } = require("./product.validation");

class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  create = async (req, res, next) => {
    try {
      const { error, value } = createProductSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({ statusCode: 400, message: "Validation error", details: error.details });
      }

      const product = await this.productService.createProduct(value, req.files || []);
      return successResponse(res, product, "Product created successfully.", 201);
    } catch (error) {
      return next(error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { error, value } = queryProductSchema.validate(req.query);
      if (error) {
        return next({ statusCode: 400, message: "Invalid query params", details: error.details });
      }

      const products = await this.productService.getProducts(value);
      return successResponse(res, products, "Products fetched successfully.");
    } catch (error) {
      return next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      return successResponse(res, product, "Product fetched successfully.");
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({ statusCode: 400, message: "Validation error", details: error.details });
      }

      const product = await this.productService.updateProduct(req.params.id, value, req.files || []);
      return successResponse(res, product, "Product updated successfully.");
    } catch (error) {
      return next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      return successResponse(res, null, "Product deleted successfully.");
    } catch (error) {
      return next(error);
    }
  };

  getReviews = async (req, res, next) => {
    try {
      const reviews = await this.productService.getProductReviews(req.params.id);
      return successResponse(res, reviews, "Reviews fetched successfully.");
    } catch (error) {
      return next(error);
    }
  };

  addReview = async (req, res, next) => {
    try {
      const { reviewProductSchema } = require("./product.validation");
      const { error, value } = reviewProductSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return next({ statusCode: 400, message: "Validation error", details: error.details });
      }

      const product = await this.productService.addReview(req.params.id, value);
      return successResponse(res, product, "Review added successfully.", 201);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = ProductController;
