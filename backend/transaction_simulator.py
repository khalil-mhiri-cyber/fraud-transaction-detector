import pandas as pd
import psycopg2
from datetime import datetime
import random
import time

print("=== Transaction Simulator ===")
print("This script simulates real-time transaction arrival")
print("Press Ctrl+C to stop\n")

# Database connection
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="fraud_detector_db",
    user="postgres",
    password="postgres123"
)
conn.autocommit = True
cursor = conn.cursor()

# Read CSV
print("Loading CSV data...")
df = pd.read_csv('../ai-model/PS_20174392719_1491204439457_log.csv')
print(f"Loaded {len(df)} transactions from CSV\n")

# Get user ID
cursor.execute("SELECT id FROM users LIMIT 1")
user_row = cursor.fetchone()
if not user_row:
    print("Error: No user found in database!")
    exit(1)
user_id = user_row[0]

# Start from row 1000 (first 1000 already imported)
current_index = 1000
devices = ['Web', 'Mobile', 'ATM', 'POS']
places = ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte', 'Kairouan', 'Gabes', 'Monastir', 'Ariana']

print("🚀 Starting simulation... Adding 1-3 transactions every 5 seconds\n")

try:
    while current_index < len(df):
        # Add 1-3 random transactions
        num_transactions = random.randint(1, 3)
        
        for _ in range(num_transactions):
            if current_index >= len(df):
                break
                
            row = df.iloc[current_index]
            
            # Prepare transaction data
            amount = float(row['amount'])
            device = random.choice(devices)
            place = random.choice(places)
            timestamp = datetime.now()
            
            # Insert into database
            cursor.execute("""
                INSERT INTO transactions (amount, device, place, time, user_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (amount, device, place, timestamp, user_id))
            
            # Determine if fraud (from CSV)
            is_fraud = bool(row['isFraud'])
            fraud_emoji = "🚨" if is_fraud else "✅"
            
            print(f"{fraud_emoji} Transaction #{current_index + 1} added: {amount:.2f} DT - {device} - {place} - {'FRAUD' if is_fraud else 'NORMAL'}")
            
            current_index += 1
        
        # Wait 5 seconds before next batch
        time.sleep(5)
        
except KeyboardInterrupt:
    print("\n\n⏸️  Simulation stopped by user")
    print(f"Total transactions added: {current_index - 1000}")
except Exception as e:
    print(f"\n❌ Error: {e}")
finally:
    cursor.close()
    conn.close()
    print("Database connection closed.")
