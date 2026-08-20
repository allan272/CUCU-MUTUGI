import { MongoClient } from 'mongodb';
import dns from 'dns';

// Helper to manually resolve mongodb+srv URIs using Google DNS to bypass local SRV blocks
async function resolveMongoSrv(connectionString: string): Promise<string> {
  if (!connectionString.startsWith('mongodb+srv://')) {
    return connectionString;
  }

  const match = connectionString.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)([^?]*)\??(.*)$/);
  if (!match) {
    return connectionString;
  }

  const [_, user, password, srvHost, dbAndPath, queryParams] = match;

  const resolver = new dns.Resolver();
  resolver.setServers(['8.8.8.8', '8.8.4.4']);

  return new Promise((resolve) => {
    resolver.resolveSrv(`_mongodb._tcp.${srvHost}`, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        console.warn('Manual SRV resolution failed, falling back to original URI:', err);
        return resolve(connectionString);
      }

      // Sort addresses by priority and weight for consistency
      const sorted = [...addresses].sort((a, b) => a.priority - b.priority || b.weight - a.weight);
      const hosts = sorted.map(addr => `${addr.name}:${addr.port}`).join(',');

      resolver.resolveTxt(srvHost, (txtErr, txtRecords) => {
        let options = 'ssl=true';
        let txtOptions = '';
        if (!txtErr && txtRecords && txtRecords.length > 0) {
          txtOptions = txtRecords.flat().join('&');
        }

        if (txtOptions) {
          options = `${options}&${txtOptions}`;
        }

        if (!options.includes('authSource=')) {
          options = `${options}&authSource=admin`;
        }

        if (queryParams) {
          options = `${options}&${queryParams}`;
        }

        const resolvedUri = `mongodb://${user}:${password}@${hosts}${dbAndPath}?${options}`;
        resolve(resolvedUri);
      });
    });
  });
}

const uri = process.env.MONGODB_URI;

// Tight timeouts so failures fail fast (not 50-90 seconds)
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 8000,
};

let clientPromise: Promise<MongoClient | null>;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`MongoDB connection timed out after ${ms}ms`)), ms)
    ),
  ]);
}

if (!uri) {
  clientPromise = Promise.resolve(null);
} else {
  const connectClient = async (): Promise<MongoClient | null> => {
    try {
      const resolvedUri = await resolveMongoSrv(uri);
      const client = new MongoClient(resolvedUri, options);
      return await withTimeout(client.connect(), 6000);
    } catch (e) {
      console.warn('MongoDB connection failed, operating in local storage mode:', e);
      return null;
    }
  };

  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient | null>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = connectClient();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    clientPromise = connectClient();
  }
}

export default clientPromise;
