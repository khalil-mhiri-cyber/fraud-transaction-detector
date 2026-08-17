package com.example.frauddetector.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private BigDecimal oldBalanceOrig;

    @Column(nullable = false)
    private BigDecimal newBalanceOrig;

    @Column(nullable = false)
    private BigDecimal oldBalanceDest;

    @Column(nullable = false)
    private BigDecimal newBalanceDest;

    @Column(nullable = false)
    private String place;

    @Column(nullable = false)
    private String device;

    @Column(nullable = false)
    private LocalDateTime time;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    // ML prediction result
    @Column(nullable = false)
    private boolean fraud;

    @Column(nullable = false)
    private BigDecimal fraudProbability;

    @Column(nullable = false)
    private String riskLevel;

    // Admin override: null=no action, APPROVED=admin approved, BLOCKED=admin blocked
    @Column
    private String adminStatus;

    public Transaction() {
    }

    public Long getId() { return id; }

    public String getAdminStatus() { return adminStatus; }
    public void setAdminStatus(String adminStatus) { this.adminStatus = adminStatus; }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getOldBalanceOrig() {
        return oldBalanceOrig;
    }

    public void setOldBalanceOrig(BigDecimal oldBalanceOrig) {
        this.oldBalanceOrig = oldBalanceOrig;
    }

    public BigDecimal getNewBalanceOrig() {
        return newBalanceOrig;
    }

    public void setNewBalanceOrig(BigDecimal newBalanceOrig) {
        this.newBalanceOrig = newBalanceOrig;
    }

    public BigDecimal getOldBalanceDest() {
        return oldBalanceDest;
    }

    public void setOldBalanceDest(BigDecimal oldBalanceDest) {
        this.oldBalanceDest = oldBalanceDest;
    }

    public BigDecimal getNewBalanceDest() {
        return newBalanceDest;
    }

    public void setNewBalanceDest(BigDecimal newBalanceDest) {
        this.newBalanceDest = newBalanceDest;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
    }

    public BigDecimal getFraudProbability() {
        return fraudProbability;
    }

    public void setFraudProbability(BigDecimal fraudProbability) {
        this.fraudProbability = fraudProbability;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}