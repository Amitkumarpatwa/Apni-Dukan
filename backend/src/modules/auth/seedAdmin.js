const bcrypt = require("bcryptjs");
const Admin = require("./auth.model");
const logger = require("../../utils/logger");

const DEFAULT_ADMIN_EMAIL = "admin@apnidukan.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

const seedDefaultAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD).trim();

  if (!email || !password) {
    logger.warn("Default admin seed skipped: ADMIN_EMAIL or ADMIN_PASSWORD is empty.");
    return;
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({
    email,
    password: hashedPassword,
    role: "admin",
  });

  logger.info(`Default admin created: ${email}`);
};

module.exports = { seedDefaultAdmin };
