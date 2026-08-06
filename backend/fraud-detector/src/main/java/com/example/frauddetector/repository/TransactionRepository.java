package com.example.frauddetector.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.frauddetector.entity.Transaction;

public interface TransactionRepository 
        extends JpaRepository<Transaction, Long> {

}