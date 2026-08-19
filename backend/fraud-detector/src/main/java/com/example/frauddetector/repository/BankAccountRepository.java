package com.example.frauddetector.repository;

import com.example.frauddetector.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    
    List<BankAccount> findByUserId(Long userId);
    
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    
    Optional<BankAccount> findByIban(String iban);
    
    Optional<BankAccount> findByUserIdAndIsPrimaryTrue(Long userId);
    
    List<BankAccount> findByUserIdAndStatus(Long userId, String status);
    
    boolean existsByAccountNumber(String accountNumber);
    
    boolean existsByIban(String iban);
}
