import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let dbInstance: any = null;

export async function getDatabase() {
  if (dbInstance) return dbInstance;
  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;

  dbInstance = await open({
    filename: isProduction ? ':memory:' : path.join(__dirname, '../database.db'),
    driver: sqlite3.Database
  });
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      companyName TEXT NOT NULL,
      jobTitle TEXT NOT NULL,
      jobType TEXT NOT NULL,
      status TEXT NOT NULL,
      appliedDate TEXT NOT NULL,
      notes TEXT
    )
  `);

  return dbInstance;
}
export async function initDb() {
  return await getDatabase();
}