import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { usersTable } from './db/schema';
import * as fs from 'fs';
import * as path from 'path';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);

  // Prepare file path and data
  const filePath = path.join(__dirname, 'app', 'data-table-components', 'data.json');
  const jsonData = JSON.stringify(users, null, 2);  // 2 is for pretty printing

  // Write data to JSON file
  try {
    fs.writeFileSync(filePath, jsonData, 'utf-8');
    console.log(`Data written to ${filePath}`);
  } catch (err) {
    console.error('Error writing to file', err);
  }
}

main();
