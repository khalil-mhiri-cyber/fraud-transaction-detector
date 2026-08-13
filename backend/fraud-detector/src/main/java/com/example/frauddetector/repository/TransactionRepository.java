package com.example.frauddetector.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.frauddetector.entity.Transaction;

public interface TransactionRepository 
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByAmountGreaterThan(Double amount);

    List<Transaction> findByAmountBetween(Double minAmount, Double maxAmount);

    List<Transaction> findByPlaceContainingIgnoreCase(String place);

    List<Transaction> findByDeviceContainingIgnoreCase(String device);

    List<Transaction> findByTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    // stats queries
    @Query("SELECT SUM(t.amount) FROM Transaction t")
    Double getTotalAmount();

    @Query("SELECT AVG(t.amount) FROM Transaction t")
    Double getAverageAmount();

    @Query("SELECT MAX(t.amount) FROM Transaction t")
    Double getMaxAmount();

    @Query("SELECT MIN(t.amount) FROM Transaction t")
    Double getMinAmount();

    @Query("SELECT COUNT(DISTINCT t.user.id) FROM Transaction t")
    Long getUniqueUsersCount();

    @Query("SELECT t.user.id, t.user.name, t.user.email, COUNT(t), SUM(t.amount), AVG(t.amount) " +
           "FROM Transaction t GROUP BY t.user.id, t.user.name, t.user.email")
    List<Object[]> getUserStats();
}