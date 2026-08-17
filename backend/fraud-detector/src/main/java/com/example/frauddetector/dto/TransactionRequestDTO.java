package com.example.frauddetector.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

public class TransactionRequestDTO {

    @NotBlank(message = "Type is required")
    @Pattern(regexp = "PAYMENT|TRANSFER|CASH_OUT|DEBIT|CASH_IN", 
             message = "Type must be one of: PAYMENT, TRANSFER, CASH_OUT, DEBIT, CASH_IN")
    private String type;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @DecimalMax(value = "1000000.00", message = "Amount must be less than 1,000,000")
    private BigDecimal amount;

    @NotNull(message = "Old balance origin is required")
    @DecimalMin(value = "0.0", message = "Old balance origin must be non-negative")
    @JsonProperty("oldbalanceOrg")
    private BigDecimal oldBalanceOrig;

    @NotNull(message = "New balance origin is required")
    @DecimalMin(value = "0.0", message = "New balance origin must be non-negative")
    @JsonProperty("newbalanceOrig")
    private BigDecimal newBalanceOrig;

    @NotNull(message = "Old balance destination is required")
    @DecimalMin(value = "0.0", message = "Old balance destination must be non-negative")
    @JsonProperty("oldbalanceDest")
    private BigDecimal oldBalanceDest;

    @NotNull(message = "New balance destination is required")
    @DecimalMin(value = "0.0", message = "New balance destination must be non-negative")
    @JsonProperty("newbalanceDest")
    private BigDecimal newBalanceDest;

    @NotBlank(message = "Place is required")
    @Size(min = 2, max = 100, message = "Place must be between 2 and 100 characters")
    private String place;

    @NotBlank(message = "Device is required")
    @Size(min = 2, max = 100, message = "Device must be between 2 and 100 characters")
    private String device;

    @NotNull(message = "Time is required")
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