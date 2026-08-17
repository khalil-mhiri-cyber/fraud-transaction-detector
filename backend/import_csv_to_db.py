import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch
from datetime import datetime, timedelta
import random

# Database connection
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="fraud_detector_db",
    user="postgres",
    password="postgres123"
)
cursor = conn.cursor()

# Read CSV (limited to first 1000 rows for demo)
print("Reading CSV file...")
df = pd.read_csv('ai-model/PS_20174392719_1491204439457_log.csv', nrows=1000)

print(f"Loaded {len(df)} transactions from CSV")

# Prepare data for insertion
transactions = []
base_time = datetime.now() - timedelta(hours=24)  # Start from 24 hours ago

# First, get or create a default user
cursor.execute("SELECT id FROM users LIMIT 1")
user_row = cursor.fetchone()
if user_row:
    default_user_id = user_row[0]
else:
    # Create a default user
    cursor.execute("""
        INSERT INTO users (username, email, password_hash, role)
        VALUES ('demo_user', 'demo@example.com', 'hashed_password', 'CUSTOMER')
        RETURNING id
    """)
    default_user_id = cursor.fetchone()[0]
    conn.commit()

print(f"Using user ID: {default_user_id}")

for idx, row in df.iterrows():
    # Generate timestamp (spread over last 24 hours)
    timestamp = base_time + timedelta(seconds=idx * 86)  # ~86 seconds between each transaction
    
    # Map transaction type
    tx_type = row['type']
    
    # Random device and place
    devices = ['Web', 'Mobile', 'ATM', 'POS']
    places = ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte', 'Kairouan', 'Gabes']
    
    # Calculate risk level
    is_fraud = bool(row['isFraud'])
    fraud_prob = 0.95 if is_fraud else 0.15
    risk_level = 'HIGH' if is_fraud else 'LOW'
    
    transactions.append((
        float(row['amount']),
        random.choice(devices),
        random.choice(places),
        timestamp,
        default_user_id
    ))

# Insert into database
print("Inserting transactions into database...")
insert_query = """
    INSERT INTO transactions (amount, device, place, time, user_id)
    VALUES (%s, %s, %s, %s, %s)
"""

execute_batch(cursor, insert_query, transactions, page_size=100)
conn.commit()

print(f"✅ Successfully imported {len(transactions)} transactions!")

# Show stats
cursor.execute("SELECT COUNT(*) FROM transactions")
total_count = cursor.fetchone()[0]

print(f"\n📊 Statistics:")
print(f"   Total transactions in DB: {total_count}")
print(f"   Just imported: {len(transactions)}")

cursor.close()
conn.close()
print("\n✅ Database connection closed.")
