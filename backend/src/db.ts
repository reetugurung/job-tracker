import Database from 'better-sqlite3';
import path from 'path';

let db: any = null;

export function initDb() {
  if (!db) {
    const dbPath = path.resolve(process.cwd(), 'database.sqlite');
    
    db = new Database(dbPath);
    db.prepare(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        companyName TEXT,
        jobTitle TEXT,
        jobType TEXT,
        status TEXT,
        appliedDate TEXT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  }
  return db;
}