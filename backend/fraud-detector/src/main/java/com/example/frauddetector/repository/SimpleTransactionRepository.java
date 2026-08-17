package com.example.frauddetector.repository;

import com.example.frauddetector.entity.SimpleTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimpleTransactionRepository extends JpaRepository<SimpleTransaction, Long> {
}
