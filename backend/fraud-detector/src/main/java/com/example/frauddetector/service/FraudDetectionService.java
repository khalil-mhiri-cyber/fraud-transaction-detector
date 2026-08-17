package com.example.frauddetector.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.frauddetector.dto.FraudPredictionResponseDTO;
import com.example.frauddetector.dto.TransactionRequestDTO;

@Service
public class FraudDetectionService {

    private final RestClient restClient;

    public FraudDetectionService(RestClient restClient) {
        this.restClient = restClient;
    }

    public FraudPredictionResponseDTO predictFraud(
            TransactionRequestDTO transaction
    ) {

        System.out.println("=================================");
        System.out.println("1. Sending transaction to Python...");

        System.out.println("type = " + transaction.getType());
        System.out.println("amount = " + transaction.getAmount());
        System.out.println("oldBalanceOrig = " + transaction.getOldBalanceOrig());
        System.out.println("newBalanceOrig = " + transaction.getNewBalanceOrig());
        System.out.println("oldBalanceDest = " + transaction.getOldBalanceDest());
        System.out.println("newBalanceDest = " + transaction.getNewBalanceDest());
        System.out.println("place = " + transaction.getPlace());
        System.out.println("device = " + transaction.getDevice());
        System.out.println("time = " + transaction.getTime());

        try {

            FraudPredictionResponseDTO response = restClient
                    .post()
                    .uri("/predict")
                    .body(transaction)
                    .retrieve()
                    .body(FraudPredictionResponseDTO.class);

            System.out.println("2. Python response received!");
            System.out.println("Response: " + response);

            if (response != null) {
                System.out.println(
                        "fraudProbability = "
                                + response.getFraudProbability()
                );
            }

            // Post-process: enrich AI score with context rules
            if (response != null) {
                double score = response.getFraudProbability();

                // Rule 1: amount exceeds balance → highly suspicious
                double amount = transaction.getAmount().doubleValue();
                double oldOrig = transaction.getOldBalanceOrig().doubleValue();
                if (oldOrig > 0 && amount >= oldOrig * 0.95) score = Math.min(score + 0.60, 0.99);

                // Rule 2: unknown device penalty
                String device = transaction.getDevice() != null ? transaction.getDevice().toLowerCase() : "";
                if (device.contains("unknown")) score = Math.min(score + 0.20, 0.99);

                // Rule 3: large transfer penalty
                if ("TRANSFER".equals(transaction.getType()) && amount > 10000) score = Math.min(score + 0.15, 0.99);

                if (score != response.getFraudProbability()) {
                    response.setFraudProbability(score);
                    response.setFraud(score >= 0.7);
                    response.setRiskLevel(score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW");
                    System.out.println("Enriched score after rules: " + score);
                }
            }

            return response;

        } catch (Exception e) {

            System.out.println("=================================");
            System.out.println("Python API unavailable — using rule-based fallback");
            System.out.println("=================================");

            // Fallback: simple rule-based fraud detection
            return fallbackPrediction(transaction);
        }
    }

    /**
     * Rule-based fallback when Python AI is unavailable.
     * Detects common fraud patterns from the PaySim dataset.
     */
    private FraudPredictionResponseDTO fallbackPrediction(TransactionRequestDTO tx) {
        double amount = tx.getAmount().doubleValue();
        double oldOrig = tx.getOldBalanceOrig().doubleValue();
        double newOrig = tx.getNewBalanceOrig().doubleValue();
        double oldDest = tx.getOldBalanceDest().doubleValue();
        double newDest = tx.getNewBalanceDest().doubleValue();
        String type = tx.getType();

        double score = 0.05; // baseline

        // Pattern 1: account drained completely
        if (oldOrig > 0 && newOrig == 0) score += 0.40;

        // Pattern 2: money disappeared (not received at destination)
        if (oldDest == 0 && newDest == 0 && amount > 0) score += 0.35;

        // Pattern 3: high-risk transaction types
        if ("TRANSFER".equals(type) || "CASH_OUT".equals(type)) score += 0.10;

        // Pattern 4: large amount
        if (amount > 10000) score += 0.15;
        else if (amount > 5000) score += 0.08;

        // Pattern 5: unknown device
        String device = tx.getDevice() != null ? tx.getDevice().toLowerCase() : "";
        if (device.contains("unknown")) score += 0.15;

        score = Math.min(score, 0.99);

        FraudPredictionResponseDTO result = new FraudPredictionResponseDTO();
        result.setFraud(score >= 0.7);
        result.setFraudProbability(score);
        result.setRiskLevel(score >= 0.7 ? "HIGH" : score >= 0.4 ? "MEDIUM" : "LOW");

        System.out.println("Fallback prediction: score=" + score + " fraud=" + result.isFraud());
        return result;
    }
}