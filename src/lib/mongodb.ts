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
const options = {};

let clientPromise: Promise<MongoClient>;

if (!uri) {
  clientPromise = Promise.reject(new Error('MONGODB_URI is not set in environment variables.'));
  clientPromise.catch(() => {});
} else {
  const connectClient = async (): Promise<MongoClient> => {
    const resolvedUri = await resolveMongoSrv(uri);
    const client = new MongoClient(resolvedUri, options);
    return client.connect();
  };

  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
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
