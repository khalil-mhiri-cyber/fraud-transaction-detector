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


public User getUser() {
    return user;
}

public void setUser(User user) {
    this.user = user;
}
}