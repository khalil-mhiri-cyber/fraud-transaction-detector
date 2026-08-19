package com.example.frauddetector.repository;

import com.example.frauddetector.entity.IdentityVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IdentityVerificationRepository extends JpaRepository<IdentityVerification, Long> {
    
    Optional<IdentityVerification> findByUserId(Long userId);
    
    Optional<IdentityVerification> findByIdNumber(String idNumber);
    
    List<IdentityVerification> findByVerificationStatus(String status);
    
    boolean existsByIdNumber(String idNumber);
    
    boolean existsByUserId(Long userId);
}
