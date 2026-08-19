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

    @Column(name = "type")
    private String type;

    @Column(name = "amount")
    private BigDecimal amount;

    @Column(name = "old_balance_orig")
    private BigDecimal oldBalanceOrig;

    @Column(name = "new_balance_orig")
    private BigDecimal newBalanceOrig;

    @Column(name = "old_balance_dest")
    private BigDecimal oldBalanceDest;

    @Column(name = "new_balance_dest")
    private BigDecimal newBalanceDest;

    @Column(name = "place")
    private String place;

    @Column(name = "device")
    private String device;

    @Column(name = "time")
    private LocalDateTime time;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    // ML prediction result
    @Column(name = "is_fraud")
    private boolean fraud;

    @Column(name = "fraud_probability")
    private BigDecimal fraudProbability;

    @Column(name = "risk_level")
    private String riskLevel;

    // Admin override: null=no action, APPROVED=admin approved, BLOCKED=admin blocked
    @Column(name = "admin_status")
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