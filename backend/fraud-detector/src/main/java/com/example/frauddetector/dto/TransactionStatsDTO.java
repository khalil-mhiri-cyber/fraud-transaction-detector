package com.example.frauddetector.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatsDTO {
    private Long totalTransactions;
    private Double totalAmount;
    private Double averageAmount;
    private Double maxAmount;
    private Double minAmount;
    private Long uniqueUsers;
}
