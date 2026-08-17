package com.example.frauddetector.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "payment_cards")
public class PaymentCard {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String cardNumber; // last 4 digits stored (masked)

    @Column(nullable = false)
    private String cardType; // VISA, MASTERCARD, etc.

    @Column(nullable = false)
    private String expiryDate; // MM/YY

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;

    @Column(name = "is_primary", nullable = false)
    private boolean primary = false;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    public PaymentCard() {}

    public Long getId() { return id; }
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
