const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./modules/product/product.routes");
const authRoutes = require("./modules/auth/auth.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend is running." });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

// Serve frontend in production
if (process.env.NODE_ENV === "production" || process.env.SERVE_FRONTEND === "true") {
  // __dirname is backend/src, so we go up twice to backend and then to frontend/dist
  // or we configure docker to have them side-by-side
  // Since Docker will place frontend/dist alongside backend, we will use path.join
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
  });
}

module.exports = app;
