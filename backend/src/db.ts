import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function initDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, '../database.db'),
    driver: sqlite3.Database
  });
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      companyName TEXT NOT NULL,
      jobTitle TEXT NOT NULL,
      jobType TEXT CHECK(jobType IN ('INTERNSHIP', 'FULL_TIME', 'PART_TIME')) NOT NULL,
      status TEXT CHECK(status IN ('APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED')) NOT NULL,
      appliedDate TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return dbInstance;
}