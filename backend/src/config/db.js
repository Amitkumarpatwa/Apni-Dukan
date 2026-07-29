const mongoose = require("mongoose");

const DEFAULT_DB_NAME = "apnidukan";

/**
 * If the URI has no database path (common with local `mongodb://host:27017/`),
 * append DEFAULT_DB_NAME so collections don't silently land in `test`.
 */
const ensureMongoDbUri = (uri, dbName = DEFAULT_DB_NAME) => {
  const trimmed = uri.trim();
  const qIndex = trimmed.indexOf("?");
  const query = qIndex >= 0 ? trimmed.slice(qIndex) : "";
  let base = qIndex >= 0 ? trimmed.slice(0, qIndex) : trimmed;
  base = base.replace(/\/+$/, "");

  const m = base.match(/^(mongodb(\+srv)?:\/\/[^/?#]+)(\/[^?]*)?$/i);
  if (!m) {
    return trimmed;
  }

  const [, hostPart, rawPath = ""] = m;
  const pathSegment = rawPath && rawPath !== "/" ? rawPath.slice(1) : "";
  if (!pathSegment) {
    return `${hostPart}/${dbName}${query}`;
  }

  return trimmed;
};

const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables.");
  }

  const resolvedUri = ensureMongoDbUri(mongoUri, process.env.MONGO_DB_NAME || DEFAULT_DB_NAME);

  await mongoose.connect(resolvedUri);
};

module.exports = { connectDatabase, ensureMongoDbUri };
