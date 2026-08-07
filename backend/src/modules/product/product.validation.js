const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().min(2).max(60).optional(),
  outOfStock: Joi.boolean().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(120).optional(),
  price: Joi.number().min(0).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  category: Joi.string().min(2).max(60).optional(),
  outOfStock: Joi.boolean().optional(),
  existingImages: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string())
    .optional(),
}).min(1);

const queryProductSchema = Joi.object({
  search: Joi.string().allow("").optional(),
  category: Joi.string().allow("").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
});

const reviewProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(3).max(1000).required(),
});

module.exports = { createProductSchema, updateProductSchema, queryProductSchema, reviewProductSchema };
