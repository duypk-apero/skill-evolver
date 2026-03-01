// SQLite database singleton with auto-migration and per-project isolation
import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || join(__dirname, '..');

let _db = null;

/**
 * Derive a short project identifier from git remote URL or CWD.
 * Ensures each project gets its own isolated SQLite database.
 */
function getProjectId() {
  try {
    const remote = execSync('git remote get-url origin 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 3000,
    }).trim();
    if (remote) return remote;
  } catch {
    // Not a git repo or no remote — fall back to CWD
  }
  return process.cwd();
}

/**
 * Get or create the SQLite database connection.
 * Auto-creates data dir and runs schema on first call.
 * Uses per-project DB isolation based on git remote or CWD.
 */
export function getDb() {
  if (_db) return _db;

  const dbDir = join(PLUGIN_ROOT, 'data');
  mkdirSync(dbDir, { recursive: true });

  // Per-project DB: hash the project identifier for a safe filename
  const projectId = getProjectId();
  const hash = createHash('sha256').update(projectId).digest('hex').slice(0, 8);
  const dbName = `skill-evolver-${hash}.db`;

  _db = new Database(join(dbDir, dbName));
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  // Run schema migrations
  const schemaPath = join(PLUGIN_ROOT, 'db', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  _db.exec(schema);

  return _db;
}

/** Close the database connection gracefully */
export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}
