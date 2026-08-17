import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="fraud_detector_db",
    user="postgres",
    password="postgres123"
)
cursor = conn.cursor()

# Get column names
cursor.execute("""
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'transactions'
    ORDER BY ordinal_position
""")

print("Columns in 'transactions' table:")
print("-" * 50)
for row in cursor.fetchall():
    print(f"  {row[0]:<25} {row[1]}")

cursor.close()
conn.close()
