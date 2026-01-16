import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.test" });

const testUrl = process.env.DATABASE_URL_TEST;
if (!testUrl) {
  throw new Error("DATABASE_URL_TEST is not set. Check .env.test");
}

const url = new URL(testUrl);
const dbName = url.pathname.replace("/", "");
if (!dbName) {
  throw new Error("DATABASE_URL_TEST must include a database name");
}

url.pathname = "/postgres";

const client = new pg.Client({ connectionString: url.toString() });

async function ensureTestDb() {
  try {
    await client.connect();
  } catch {
    throw new Error(
      "Postgres is not reachable at localhost:5432. Start it with `docker compose up -d`.",
    );
  }

  const exists = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (exists.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
  }

  await client.end();
}

ensureTestDb().catch(async (error) => {
  try {
    await client.end();
  } catch {
    // ignore
  }
  throw error;
});
