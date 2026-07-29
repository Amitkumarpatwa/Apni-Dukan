const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const app = require("./app");
const { connectDatabase } = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");
const { seedDefaultAdmin } = require("./modules/auth/seedAdmin");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDefaultAdmin();
    configureCloudinary();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
