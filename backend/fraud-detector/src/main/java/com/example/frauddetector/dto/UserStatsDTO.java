package com.example.frauddetector.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private Long transactionCount;
    private Double totalSpent;
    private Double averageTransaction;
}
