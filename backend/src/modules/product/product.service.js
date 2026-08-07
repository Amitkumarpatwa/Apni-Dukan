const streamifier = require("streamifier");
const { cloudinary } = require("../../config/cloudinary");

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async uploadImages(files) {
    if (!files?.length) {
      return [];
    }

    const uploads = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "apnidukan/products", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result.secure_url);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    return Promise.all(uploads);
  }

  async createProduct(payload, files) {
    const imageUrls = await this.uploadImages(files);
    return this.productRepository.create({
      ...payload,
      images: imageUrls,
    });
  }

  async getProducts(query) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;
    const filter = {};

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }

    const [items, total] = await Promise.all([
      this.productRepository.findAll(filter, { skip, limit, sort: { createdAt: -1 } }),
      this.productRepository.count(filter),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw { statusCode: 404, message: "Product not found." };
    }
    return product;
  }

  async updateProduct(id, payload, files) {
    const existingImages = payload.existingImages
      ? Array.isArray(payload.existingImages)
        ? payload.existingImages
        : [payload.existingImages]
      : [];

    const newUrls = await this.uploadImages(files);
    const updatePayload = {
      ...payload,
      images: [...existingImages, ...newUrls],
    };
    delete updatePayload.existingImages;

    const updated = await this.productRepository.updateById(id, updatePayload);
    if (!updated) {
      throw { statusCode: 404, message: "Product not found." };
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await this.productRepository.deleteById(id);
    if (!deleted) {
      throw { statusCode: 404, message: "Product not found." };
    }
    return deleted;
  }

  async getProductReviews(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw { statusCode: 404, message: "Product not found." };
    }
    // Return reviews, sorted by newest first
    return product.reviews.sort((a, b) => b.createdAt - a.createdAt);
  }

  async addReview(id, reviewData) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw { statusCode: 404, message: "Product not found." };
    }

    product.reviews.push(reviewData);
    product.reviewsCount = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    return product;
  }
}

module.exports = ProductService;
