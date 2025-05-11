import Database from "better-sqlite3";
const database = new Database("./db.sql");

export const initTables = () => {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS user (
      userId TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      equipped INTEGER,
      FOREIGN KEY (equipped) REFERENCES inventory(id)
    )
  `;

const createInventoryTable = `
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id TEXT, -- Retire le NOT NULL ici
    itemJSON TEXT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES user(userId)
  )
`;

  const createEnemyTable = `
    CREATE TABLE IF NOT EXISTS enemy (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      health INTEGER NOT NULL,
      dropItemId INTEGER,
      FOREIGN KEY (dropItemId) REFERENCES inventory(id)
    )
  `;

  database.prepare(createUserTable).run();
  database.prepare(createInventoryTable).run();
  database.prepare(createEnemyTable).run();
};

export default database;
