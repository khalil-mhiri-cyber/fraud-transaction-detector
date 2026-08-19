package com.example.frauddetector.repository;

import com.example.frauddetector.entity.BankTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BankTransferRepository extends JpaRepository<BankTransfer, Long> {
    
    List<BankTransfer> findByFromAccountId(Long accountId);
    
    List<BankTransfer> findByFromAccountIdOrderByInitiatedAtDesc(Long accountId);
    
    List<BankTransfer> findByStatus(String status);
    
    List<BankTransfer> findByFromAccountIdAndStatus(Long accountId, String status);
    
    List<BankTransfer> findByInitiatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    List<BankTransfer> findByFromAccountIdAndInitiatedAtBetween(Long accountId, LocalDateTime start, LocalDateTime end);
    
    Long countByFromAccountIdAndStatus(Long accountId, String status);
}
