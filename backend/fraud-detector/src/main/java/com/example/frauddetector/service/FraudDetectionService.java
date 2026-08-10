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

        return response;

    } catch (Exception e) {

        System.out.println("=================================");
        System.out.println("ERROR CALLING PYTHON");
        System.out.println("Exception: " + e.getClass().getName());
        System.out.println("Message: " + e.getMessage());
        System.out.println("=================================");

        e.printStackTrace();

        throw e;
    }
}
}