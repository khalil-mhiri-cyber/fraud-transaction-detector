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
    private BigDecimal amount;


    @Column(nullable = false)
    private String place;


    @Column(nullable = false)
    private String device;


    @Column(nullable = false)
    private LocalDateTime time;


    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;


    public Transaction() {
    }


    public Long getId() {
        return id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getPlace() {
        return place;
    }

    public String getDevice() {
        return device;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public User getUser() {
        return user;
    }
     public void setUser(User user) {
        this.user = user;
    }
}