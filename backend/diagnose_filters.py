import psycopg2

print("=== Diagnosing Transaction Filter Issue ===\n")

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="fraud_detector_db",
    user="postgres",
    password="postgres123"
)
cursor = conn.cursor()

# Check total count
cursor.execute("SELECT COUNT(*) FROM transactions")
total = cursor.fetchone()[0]
print(f"Total transactions: {total}")

# Check fraud distribution
cursor.execute("SELECT COUNT(*) FROM transactions WHERE is_fraud = TRUE")
fraud_count = cursor.fetchone()[0]
print(f"Fraud transactions (is_fraud=TRUE): {fraud_count}")

cursor.execute("SELECT COUNT(*) FROM transactions WHERE is_fraud = FALSE")
normal_count = cursor.fetchone()[0]
print(f"Normal transactions (is_fraud=FALSE): {normal_count}")

# Check admin_status distribution
print("\nAdmin Status Distribution:")
cursor.execute("""
    SELECT admin_status, COUNT(*) 
    FROM transactions 
    GROUP BY admin_status 
    ORDER BY COUNT(*) DESC
""")
for status, count in cursor.fetchall():
    status_display = status if status else "NULL"
    print(f"  {status_display}: {count}")

# Check fraud with admin status
print("\nFraud transactions by admin status:")
cursor.execute("""
    SELECT admin_status, COUNT(*) 
    FROM transactions 
    WHERE is_fraud = TRUE
    GROUP BY admin_status 
    ORDER BY COUNT(*) DESC
""")
for status, count in cursor.fetchall():
    status_display = status if status else "NULL"
    print(f"  {status_display}: {count}")

# Sample fraud transaction
print("\nSample fraud transaction:")
cursor.execute("""
    SELECT id, amount, is_fraud, fraud_probability, admin_status, time
    FROM transactions 
    WHERE is_fraud = TRUE
    LIMIT 1
""")
sample = cursor.fetchone()
if sample:
    print(f"  ID: {sample[0]}")
    print(f"  Amount: {sample[1]}")
    print(f"  is_fraud: {sample[2]}")
    print(f"  fraud_probability: {sample[3]}")
    print(f"  admin_status: {sample[4]}")
    print(f"  time: {sample[5]}")

# Sample normal transaction
print("\nSample normal transaction:")
cursor.execute("""
    SELECT id, amount, is_fraud, fraud_probability, admin_status, time
    FROM transactions 
    WHERE is_fraud = FALSE
    LIMIT 1
""")
sample = cursor.fetchone()
if sample:
    print(f"  ID: {sample[0]}")
    print(f"  Amount: {sample[1]}")
    print(f"  is_fraud: {sample[2]}")
    print(f"  fraud_probability: {sample[3]}")
    print(f"  admin_status: {sample[4]}")
    print(f"  time: {sample[5]}")

cursor.close()
conn.close()
print("\n✓ Diagnosis complete!")
