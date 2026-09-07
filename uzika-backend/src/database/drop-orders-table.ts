import { Client } from 'pg';
import 'dotenv/config';

async function dropOrdersTable() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await client.connect();
  await client.query('DROP TABLE IF EXISTS "order" CASCADE;');
  console.log('Dropped the "order" table.');
  await client.end();
}

dropOrdersTable();