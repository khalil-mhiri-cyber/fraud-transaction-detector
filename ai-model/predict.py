"""
Predict fraud on new transactions
"""

import joblib
import numpy as np

# Load models
model = joblib.load('fraud_detection_model.joblib')
scaler = joblib.load('scaler.joblib')
encoder = joblib.load('label_encoder_type.joblib')


def predict_fraud(transaction):
    """
    Predict if a transaction is fraudulent
    
    Args:
        transaction: dict with keys: type, amount, oldbalanceOrg, 
                     newbalanceOrig, oldbalanceDest, newbalanceDest
    
    Returns:
        dict with prediction and probability
    """
    # Calculate error features
    error_orig = (transaction['newbalanceOrig'] + transaction['amount'] - 
                  transaction['oldbalanceOrg'])
    error_dest = (transaction['oldbalanceDest'] + transaction['amount'] - 
                  transaction['newbalanceDest'])
    
    # Encode type
    type_encoded = encoder.transform([transaction['type']])[0]
    
    # Create feature vector
    features = np.array([[
        transaction['amount'],
        transaction['oldbalanceOrg'],
        transaction['newbalanceOrig'],
        transaction['oldbalanceDest'],
        transaction['newbalanceDest'],
        error_orig,
        error_dest,
        type_encoded
    ]])
    
    # Scale and predict
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0, 1]
    
    return {
        'is_fraud': bool(prediction),
        'fraud_probability': float(probability),
        'risk_level': 'HIGH' if probability > 0.7 else 'MEDIUM' if probability > 0.4 else 'LOW'
    }


# Test examples
if __name__ == '__main__':
    # Suspicious transaction
    fraud_example = {
        'type': 'TRANSFER',
        'amount': 181.00,
        'oldbalanceOrg': 181.00,
        'newbalanceOrig': 0.00,
        'oldbalanceDest': 0.00,
        'newbalanceDest': 0.00
    }
    
    print("Testing suspicious transaction:")
    print(fraud_example)
    result = predict_fraud(fraud_example)
    print(f"\nResult: {result}")
    print(f"Fraud: {'YES' if result['is_fraud'] else 'NO'}")
    print(f"Probability: {result['fraud_probability']:.2%}")
    print(f"Risk: {result['risk_level']}")
    
    print("\n" + "="*50 + "\n")
    
    # Normal transaction
    normal_example = {
        'type': 'CASH_OUT',
        'amount': 50.00,
        'oldbalanceOrg': 500.00,
        'newbalanceOrig': 450.00,
        'oldbalanceDest': 1000.00,
        'newbalanceDest': 1050.00
    }
    
    print("Testing normal transaction:")
    print(normal_example)
    result = predict_fraud(normal_example)
    print(f"\nResult: {result}")
    print(f"Fraud: {'YES' if result['is_fraud'] else 'NO'}")
    print(f"Probability: {result['fraud_probability']:.2%}")
    print(f"Risk: {result['risk_level']}")
