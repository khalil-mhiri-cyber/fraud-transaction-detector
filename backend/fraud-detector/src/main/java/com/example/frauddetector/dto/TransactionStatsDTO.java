package com.example.frauddetector.dto;

public class TransactionStatsDTO {

    private Long totalTransactions;
    private Double totalAmount;
    private Double averageAmount;
    private Double maxAmount;
    private Double minAmount;
    private Long uniqueUsers;

    public TransactionStatsDTO() {}

    public TransactionStatsDTO(Long totalTransactions, Double totalAmount, Double averageAmount,
                                Double maxAmount, Double minAmount, Long uniqueUsers) {
        this.totalTransactions = totalTransactions;
        this.totalAmount = totalAmount;
        this.averageAmount = averageAmount;
        this.maxAmount = maxAmount;
        this.minAmount = minAmount;
        this.uniqueUsers = uniqueUsers;
    }

    public Long getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(Long totalTransactions) { this.totalTransactions = totalTransactions; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getAverageAmount() { return averageAmount; }
    public void setAverageAmount(Double averageAmount) { this.averageAmount = averageAmount; }

    public Double getMaxAmount() { return maxAmount; }
    public void setMaxAmount(Double maxAmount) { this.maxAmount = maxAmount; }

    public Double getMinAmount() { return minAmount; }
    public void setMinAmount(Double minAmount) { this.minAmount = minAmount; }

    public Long getUniqueUsers() { return uniqueUsers; }
    public void setUniqueUsers(Long uniqueUsers) { this.uniqueUsers = uniqueUsers; }
}
