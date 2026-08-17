package com.example.frauddetector.dto;

import java.math.BigDecimal;

public class PaymentCardRequestDTO {
    private String cardNumber;  // full 16-digit card number (we store only last 4)
    private String cardType;
    private String expiryDate;
    private BigDecimal balance;

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
