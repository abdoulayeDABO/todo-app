import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';



export default function DBProvider({ children }: { children: React.ReactNode }) {
  return (
      <SQLiteProvider databaseName="todos.db" onInit={migrateDbIfNeeded}>
				{children}
      </SQLiteProvider>
  );
}


async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = result?.user_version ?? 0;
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL);
    `);
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

