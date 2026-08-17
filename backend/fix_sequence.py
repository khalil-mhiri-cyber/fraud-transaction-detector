import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="fraud_detector_db",
    user="postgres",
    password="postgres123"
)
conn.autocommit = True
cursor = conn.cursor()

print("Fixing transactions table ID sequence...")

# Drop existing table and recreate with proper sequence
cursor.execute("""
    DROP TABLE IF EXISTS transactions CASCADE;
    
    CREATE TABLE transactions (
        id BIGSERIAL PRIMARY KEY,
        amount NUMERIC NOT NULL,
        device VARCHAR(255) NOT NULL,
        place VARCHAR(255) NOT NULL,
        time TIMESTAMP NOT NULL,
        user_id BIGINT REFERENCES users(id)
    );
""")

print("✅ Table recreated with proper ID sequence!")

cursor.close()
conn.close()
