const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async registerAdmin(email, password) {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) {
      throw { statusCode: 409, message: "Admin already exists with this email." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await this.authRepository.create({ email, password: hashedPassword });

    return { id: admin._id, email: admin.email };
  }

  async login(email, password) {
    const admin = await this.authRepository.findByEmail(email);
    if (!admin) {
      throw { statusCode: 401, message: "Invalid email or password." };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw { statusCode: 401, message: "Invalid email or password." };
    }

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      token,
      admin: { id: admin._id, email: admin.email, role: admin.role },
    };
  }
}

module.exports = AuthService;
