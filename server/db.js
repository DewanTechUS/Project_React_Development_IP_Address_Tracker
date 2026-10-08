import { MongoClient } from "mongodb";

const DB_NAME = "dewantech_ip_tracker";
const RETENTION_SECONDS = 365 * 24 * 60 * 60; // keep data for up to 12 months

let db = null;

export async function connectDb(uri) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
  await client.connect();
  db = client.db(DB_NAME);

  await Promise.all([
    db.collection("visitors").createIndex({ visitorId: 1 }, { unique: true }),
    // Inactive profiles and old searches expire automatically.
    db.collection("visitors").createIndex({ lastSeenAt: 1 }, { expireAfterSeconds: RETENTION_SECONDS }),
    db.collection("ip_search_history").createIndex({ visitorId: 1, createdAt: -1 }),
    db.collection("ip_search_history").createIndex({ createdAt: 1 }, { expireAfterSeconds: RETENTION_SECONDS }),
  ]);
}

// Null when MONGODB_URI is not configured or the connection failed.
export function getDb() {
  return db;
}
