import Database from "better-sqlite3"
const database = new Database("./db.sql");

export const initTables = () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS user (
      userId TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      passwordHash TEXT NOT NULL
    )
  `;
  database.prepare(createUserTable).run();
};

export default database;
