package com.example.frauddetector.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.frauddetector.entity.Transaction;

public interface TransactionRepository 
        extends JpaRepository<Transaction, Long> {

    // Trouver les transactions d'un utilisateur
    List<Transaction> findByUserId(Long userId);

    // Trouver les transactions par montant supérieur
    List<Transaction> findByAmountGreaterThan(Double amount);

    // Trouver les transactions par montant entre deux valeurs
    List<Transaction> findByAmountBetween(Double minAmount, Double maxAmount);

    // Trouver les transactions par lieu
    List<Transaction> findByPlaceContainingIgnoreCase(String place);

    // Trouver les transactions par device
    List<Transaction> findByDeviceContainingIgnoreCase(String device);

    // Trouver les transactions dans une plage de dates
    List<Transaction> findByTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    // Statistiques - Somme totale des montants
    @Query("SELECT SUM(t.amount) FROM Transaction t")
    Double getTotalAmount();

    // Statistiques - Montant moyen
    @Query("SELECT AVG(t.amount) FROM Transaction t")
    Double getAverageAmount();

    // Statistiques - Montant max
    @Query("SELECT MAX(t.amount) FROM Transaction t")
    Double getMaxAmount();

    // Statistiques - Montant min
    @Query("SELECT MIN(t.amount) FROM Transaction t")
    Double getMinAmount();

    // Statistiques - Nombre d'utilisateurs uniques
    @Query("SELECT COUNT(DISTINCT t.user.id) FROM Transaction t")
    Long getUniqueUsersCount();

    // Statistiques par utilisateur
    @Query("SELECT t.user.id, t.user.name, t.user.email, COUNT(t), SUM(t.amount), AVG(t.amount) " +
           "FROM Transaction t GROUP BY t.user.id, t.user.name, t.user.email")
    List<Object[]> getUserStats();
}