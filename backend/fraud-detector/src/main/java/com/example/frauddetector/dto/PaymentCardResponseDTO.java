package com.example.frauddetector.dto;

import java.math.BigDecimal;

public class PaymentCardResponseDTO {
    private Long id;
    private String lastFour;
    private String cardType;
    private String expiryDate;
    private BigDecimal balance;
    private boolean primary;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getLastFour() { return lastFour; }
    public void setLastFour(String lastFour) { this.lastFour = lastFour; }
    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }
}
