import psycopg2
import random

print("=== Adding fraud detection to transactions ===")

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

# Add columns if they don't exist
print("Adding fraud-related columns...")
try:
    cursor.execute("""
        ALTER TABLE transactions 
        ADD COLUMN IF NOT EXISTS is_fraud BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS fraud_probability DECIMAL(5,4) DEFAULT 0.0,
        ADD COLUMN IF NOT EXISTS admin_status VARCHAR(20) DEFAULT 'PENDING'
    """)
    print("✓ Columns added")
except Exception as e:
    print(f"Note: {e}")

# Mark high-value transactions as potentially fraudulent
print("\nMarking suspicious transactions...")

# Transactions > 200,000 DT have high fraud probability
cursor.execute("""
    UPDATE transactions 
    SET is_fraud = TRUE,
        fraud_probability = 0.85 + (RANDOM() * 0.15),
        admin_status = 'PENDING'
    WHERE amount > 200000
""")
flagged_count = cursor.rowcount
print(f"✓ Flagged {flagged_count} high-value transactions as potential fraud")

# Random 2% of normal transactions as fraud (false positives for testing)
cursor.execute("""
    UPDATE transactions 
    SET is_fraud = TRUE,
        fraud_probability = 0.60 + (RANDOM() * 0.25),
        admin_status = 'PENDING'
    WHERE amount <= 200000 
    AND RANDOM() < 0.02
    AND is_fraud = FALSE
""")
random_count = cursor.rowcount
print(f"✓ Randomly flagged {random_count} transactions for testing")

# Set normal probability for non-fraud
cursor.execute("""
    UPDATE transactions 
    SET fraud_probability = 0.05 + (RANDOM() * 0.15)
    WHERE is_fraud = FALSE
""")
print("✓ Set risk scores for normal transactions")

# Count results
cursor.execute("SELECT COUNT(*) FROM transactions WHERE is_fraud = TRUE")
fraud_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM transactions")
total_count = cursor.fetchone()[0]

fraud_rate = (fraud_count / total_count * 100) if total_count > 0 else 0

print(f"\n=== Summary ===")
print(f"Total transactions: {total_count}")
print(f"Fraudulent: {fraud_count} ({fraud_rate:.2f}%)")
print(f"Normal: {total_count - fraud_count} ({100-fraud_rate:.2f}%)")

cursor.close()
conn.close()
print("\n✓ Done!")
