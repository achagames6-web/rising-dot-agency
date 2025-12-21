import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to .env file');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'rising-dot';

// Optimized connection pool settings for concurrent dashboard + frontend requests
const mongoOptions = {
  maxPoolSize: 50, // Increased from default 10
  minPoolSize: 5,  // Keep minimum connections ready
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve connection across hot reloads
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, mongoOptions);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, mongoOptions);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get database instance
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  CONTACTS: 'contacts',
  SERVICES: 'services',
  TESTIMONIALS: 'testimonials',
  SETTINGS: 'settings',
  ANALYTICS_PAGEVIEWS: 'analytics_pageviews',
  ANALYTICS_SESSIONS: 'analytics_sessions',
  ANALYTICS_EVENTS: 'analytics_events',
} as const;
