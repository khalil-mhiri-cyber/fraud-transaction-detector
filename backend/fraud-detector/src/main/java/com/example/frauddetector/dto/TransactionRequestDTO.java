package com.example.frauddetector.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionRequestDTO {

    private BigDecimal amount;
    private String place;
    private String device;
    private LocalDateTime time;

    public TransactionRequestDTO() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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