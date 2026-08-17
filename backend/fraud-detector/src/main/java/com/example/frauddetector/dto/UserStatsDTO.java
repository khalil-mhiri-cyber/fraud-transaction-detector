package com.example.frauddetector.dto;

public class UserStatsDTO {

    private Long userId;
    private String userName;
    private String userEmail;
    private Long transactionCount;
    private Double totalSpent;
    private Double averageTransaction;

    public UserStatsDTO() {}

    public UserStatsDTO(Long userId, String userName, String userEmail,
                        Long transactionCount, Double totalSpent, Double averageTransaction) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.transactionCount = transactionCount;
        this.totalSpent = totalSpent;
        this.averageTransaction = averageTransaction;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Long getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Long transactionCount) { this.transactionCount = transactionCount; }

    public Double getTotalSpent() { return totalSpent; }
    public void setTotalSpent(Double totalSpent) { this.totalSpent = totalSpent; }

    public Double getAverageTransaction() { return averageTransaction; }
    public void setAverageTransaction(Double averageTransaction) { this.averageTransaction = averageTransaction; }
}
