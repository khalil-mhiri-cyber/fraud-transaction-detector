
package com.example.frauddetector.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FraudPredictionResponseDTO {

    @JsonProperty("is_fraud")
    private boolean isFraud;

    @JsonProperty("fraud_probability")
    private double fraudProbability;

    @JsonProperty("risk_level")
    private String riskLevel;

    public FraudPredictionResponseDTO() {
    }

    public boolean isFraud() {
        return isFraud;
    }

    public void setFraud(boolean fraud) {
        isFraud = fraud;
    }

    public double getFraudProbability() {
        return fraudProbability;
    }

    public void setFraudProbability(double fraudProbability) {
        this.fraudProbability = fraudProbability;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}

