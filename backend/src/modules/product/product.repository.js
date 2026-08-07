class ProductRepository {
  constructor(productModel) {
    this.productModel = productModel;
  }

  create(payload) {
    return this.productModel.create(payload);
  }

  findAll(filter, options) {
    const { skip, limit, sort } = options;
    return this.productModel.find(filter).sort(sort).skip(skip).limit(limit);
  }

  count(filter) {
    return this.productModel.countDocuments(filter);
  }

  findById(id) {
    return this.productModel.findById(id);
  }

  updateById(id, payload) {
    return this.productModel.findByIdAndUpdate(id, payload, { new: true });
  }

  deleteById(id) {
    return this.productModel.findByIdAndDelete(id);
  }
}

module.exports = ProductRepository;
