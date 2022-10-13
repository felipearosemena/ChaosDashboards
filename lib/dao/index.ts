import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const dbName = 'chaos-dashboards'
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
const globalAny:any = global;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalAny._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalAny._mongoClientPromise = client.connect();
  }
  clientPromise = globalAny._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const connect = async () => {
  const client = await clientPromise;
  return client.db(dbName);
}
