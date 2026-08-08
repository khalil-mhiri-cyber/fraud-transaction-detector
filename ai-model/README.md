# Fraud Detection Model

Detect fraudulent transactions using machine learning.

## Files

- `predict.py` - Prediction function
- `fraud_detection.ipynb` - Jupyter notebook
- `fraud_detection_model.joblib` - Trained model
- `scaler.joblib` - Data normalizer
- `label_encoder_type.joblib` - Type encoder
- `PS_20174392719_...csv` - Dataset
- `requirements.txt` - Dependencies

## Quick Start

### Install
```bash
pip install -r requirements.txt
```

### Test
```bash
python predict.py
```

## Usage

```python
from predict import predict_fraud

transaction = {
    'type': 'TRANSFER',
    'amount': 181.00,
    'oldbalanceOrg': 181.00,
    'newbalanceOrig': 0.00,
    'oldbalanceDest': 0.00,
    'newbalanceDest': 0.00
}

result = predict_fraud(transaction)
print(result)
# {'is_fraud': True, 'fraud_probability': 0.95, 'risk_level': 'HIGH'}
```

## Transaction Format

**Required fields:**
- `type` - "TRANSFER" or "CASH_OUT"
- `amount` - Transaction amount
- `oldbalanceOrg` - Origin balance before
- `newbalanceOrig` - Origin balance after
- `oldbalanceDest` - Destination balance before
- `newbalanceDest` - Destination balance after

## Result Format

- `is_fraud` - True or False
- `fraud_probability` - 0 to 1
- `risk_level` - LOW, MEDIUM, or HIGH

## Notebook

Open Jupyter to explore or retrain:
```bash
jupyter notebook fraud_detection.ipynb
```

## Model Performance

- ROC-AUC: ~0.95
- Recall: ~80-85%
- Precision: ~75-80%

## Integration

Use `predict_fraud()` function in your application (FastAPI, Flask, Django, Node.js, etc.)
