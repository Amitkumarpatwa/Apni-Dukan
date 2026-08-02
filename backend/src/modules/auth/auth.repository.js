class AuthRepository {
  constructor(adminModel) {
    this.adminModel = adminModel;
  }

  findByEmail(email) {
    return this.adminModel.findOne({ email });
  }

  create(payload) {
    return this.adminModel.create(payload);
  }
}

module.exports = AuthRepository;
