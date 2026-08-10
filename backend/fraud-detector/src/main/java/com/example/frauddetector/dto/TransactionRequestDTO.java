package com.example.frauddetector.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TransactionRequestDTO {

    private String type;
    private BigDecimal amount;

    @JsonProperty("oldbalanceOrg")
    private BigDecimal oldBalanceOrig;

    @JsonProperty("newbalanceOrig")
    private BigDecimal newBalanceOrig;

    @JsonProperty("oldbalanceDest")
    private BigDecimal oldBalanceDest;

    @JsonProperty("newbalanceDest")
    private BigDecimal newBalanceDest;

    private String place;
    private String device;
    private LocalDateTime time;

    public TransactionRequestDTO() {
    }

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

    public void setNewBalanceDest(BigDecimal newBalanceDest) {
        this.newBalanceDest = newBalanceDest;
    }

    public BigDecimal getNewBalanceDest() {
        return newBalanceDest;
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
}