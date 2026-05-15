import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL!);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  experimental: { joins: true },
  telemetry: {
    debug: true,
  },
});
