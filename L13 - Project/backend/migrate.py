"""
Run this ONCE to update your existing database with the new columns.
Command: python migrate.py
"""
import sqlite3
import os

DB_PATH = "study_assistant.db"

if not os.path.exists(DB_PATH):
    print("No existing database found — fresh start, no migration needed.")
    exit(0)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

migrations = []

# 1. Add expires_at to uploads table
try:
    cursor.execute("ALTER TABLE uploads ADD COLUMN expires_at DATETIME")
    migrations.append("uploads.expires_at added")
except sqlite3.OperationalError:
    migrations.append("uploads.expires_at already exists (skipped)")

# 2. Make filepath nullable (SQLite doesn't support DROP NOT NULL easily, it already is nullable in practice)
migrations.append("uploads.filepath — already nullable in SQLite (no action needed)")

# 3. Fix last_upload_date default from '' to '1970-01-01' for existing users
cursor.execute("UPDATE users SET last_upload_date = '1970-01-01' WHERE last_upload_date = '' OR last_upload_date IS NULL")
affected = cursor.rowcount
migrations.append(f"Fixed last_upload_date for {affected} users")

# 4. Set expires_at for existing uploads that don't have it
cursor.execute("""
    UPDATE uploads
    SET expires_at = datetime(created_at, '+24 hours')
    WHERE expires_at IS NULL
""")
affected = cursor.rowcount
migrations.append(f"Set expires_at for {affected} existing uploads")

conn.commit()
conn.close()

print("Migration complete:")
for m in migrations:
    print(f"  ✅ {m}")
