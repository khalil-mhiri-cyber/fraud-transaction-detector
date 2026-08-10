from fastapi import FastAPI
from pydantic import BaseModel

from predict import predict_fraud


app = FastAPI()


class TransactionRequest(BaseModel):
    type: str
    amount: float
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float


@app.post("/predict")
def predict(transaction: TransactionRequest):

    result = predict_fraud(
        transaction.model_dump()
    )

    return result