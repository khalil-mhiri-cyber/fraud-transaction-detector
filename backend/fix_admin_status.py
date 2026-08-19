import psycopg2

print("=== Fixing admin_status values ===\n")

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="fraud_detector_db",
    user="postgres",
    password="postgres123"
)
conn.autocommit = True
cursor = conn.cursor()

# Update FLAGGED to PENDING
print("Updating FLAGGED → PENDING...")
cursor.execute("""
    UPDATE transactions 
    SET admin_status = 'PENDING' 
    WHERE admin_status = 'FLAGGED'
""")
updated = cursor.rowcount
print(f"✓ Updated {updated} transactions")

# Verify results
print("\nVerifying changes:")
cursor.execute("""
    SELECT admin_status, COUNT(*) 
    FROM transactions 
    GROUP BY admin_status 
    ORDER BY COUNT(*) DESC
""")
for status, count in cursor.fetchall():
    status_display = status if status else "NULL"
    print(f"  {status_display}: {count}")

cursor.close()
conn.close()
print("\n✓ Done!")
