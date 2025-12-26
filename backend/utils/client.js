import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const client = neon(process.env.DATABASE_URL,{ fullResults: true });

export default client;
