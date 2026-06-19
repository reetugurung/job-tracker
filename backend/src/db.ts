import Database from 'better-sqlite3';
import path from 'path';

let dbInstance: any = null;

export function getDatabase() {
  if (dbInstance) return dbInstance;

  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
  const dbPath = isProduction ? ':memory:' : path.join(__dirname, '../database.db');
  
  dbInstance = new Database(dbPath);
  dbInstance.exec(`
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

export function initDb() {
  return getDatabase();
}