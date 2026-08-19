package com.example.frauddetector.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.frauddetector.dto.FraudPredictionResponseDTO;
import com.example.frauddetector.dto.TransactionRequestDTO;
import com.example.frauddetector.dto.TransactionResponseDTO;
import com.example.frauddetector.dto.TransactionStatsDTO;
import com.example.frauddetector.dto.UserStatsDTO;
import com.example.frauddetector.entity.Transaction;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.exception.InvalidAmountException;
import com.example.frauddetector.exception.ResourceNotFoundException;
import com.example.frauddetector.repository.TransactionRepository;
import com.example.frauddetector.repository.UserRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final FraudDetectionService fraudDetectionService;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            FraudDetectionService fraudDetectionService
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.fraudDetectionService = fraudDetectionService;
    }

    public TransactionResponseDTO createTransaction(
            TransactionRequestDTO transactionDTO,
            Long userId
    ) {

        if (transactionDTO.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new InvalidAmountException(
                    "Amount must be positive"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Transaction transaction = new Transaction();

        transaction.setType(transactionDTO.getType());
        transaction.setAmount(transactionDTO.getAmount());

        transaction.setOldBalanceOrig(
                transactionDTO.getOldBalanceOrig()
        );

        transaction.setNewBalanceOrig(
                transactionDTO.getNewBalanceOrig()
        );

        transaction.setOldBalanceDest(
                transactionDTO.getOldBalanceDest()
        );

        transaction.setNewBalanceDest(
                transactionDTO.getNewBalanceDest()
        );

        transaction.setPlace(transactionDTO.getPlace());
        transaction.setDevice(transactionDTO.getDevice());
        transaction.setTime(transactionDTO.getTime());

        transaction.setUser(user);

        // Debug: check transaction data before sending to Python
        System.out.println("========== TRANSACTION DTO ==========");
        System.out.println("type = " + transactionDTO.getType());
        System.out.println("amount = " + transactionDTO.getAmount());
        System.out.println("oldBalanceOrig = " + transactionDTO.getOldBalanceOrig());
        System.out.println("newBalanceOrig = " + transactionDTO.getNewBalanceOrig());
        System.out.println("oldBalanceDest = " + transactionDTO.getOldBalanceDest());
        System.out.println("newBalanceDest = " + transactionDTO.getNewBalanceDest());
        System.out.println("place = " + transactionDTO.getPlace());
        System.out.println("device = " + transactionDTO.getDevice());
        System.out.println("time = " + transactionDTO.getTime());
        System.out.println("====================================");

        // Call Python ML API
        FraudPredictionResponseDTO prediction =
                fraudDetectionService.predictFraud(transactionDTO);

        // Save ML prediction inside Transaction
        transaction.setFraud(prediction.isFraud());

        transaction.setFraudProbability(
                BigDecimal.valueOf(
                        prediction.getFraudProbability()
                )
        );

        transaction.setRiskLevel(
                prediction.getRiskLevel()
        );

        // Set admin status based on fraud detection
        if (prediction.isFraud()) {
            transaction.setAdminStatus("PENDING");
        } else {
            transaction.setAdminStatus(null);
        }

        // Save transaction with prediction
        transaction = transactionRepository.save(transaction);

        return toResponseDTO(transaction);
    }

    public TransactionResponseDTO reviewTransaction(Long id, String decision) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        if (!"APPROVED".equals(decision) && !"BLOCKED".equals(decision)) {
            throw new IllegalArgumentException("Decision must be APPROVED or BLOCKED");
        }
        transaction.setAdminStatus(decision);
        transaction = transactionRepository.save(transaction);
        return toResponseDTO(transaction);
    }

    public List<TransactionResponseDTO> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public TransactionResponseDTO getTransactionById(Long id) {
        Transaction transaction =
                transactionRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Transaction not found"
                                )
                        );
        return toResponseDTO(transaction);
    }

    // Nouvelles fonctionnalités

    public List<TransactionResponseDTO> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<TransactionResponseDTO> searchByPlace(String place) {
        return transactionRepository.findByPlaceContainingIgnoreCase(place)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<TransactionResponseDTO> searchByDevice(String device) {
        return transactionRepository.findByDeviceContainingIgnoreCase(device)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<TransactionResponseDTO> getTransactionsByAmountRange(Double minAmount, Double maxAmount) {
        return transactionRepository.findByAmountBetween(minAmount, maxAmount)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<TransactionResponseDTO> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByTimeBetween(startDate, endDate)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public List<TransactionResponseDTO> getHighValueTransactions(Double threshold) {
        return transactionRepository.findByAmountGreaterThan(threshold)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Stats
    public TransactionStatsDTO getStatistics() {
        Long totalTransactions = transactionRepository.count();
        Double totalAmount = transactionRepository.getTotalAmount();
        Double avgAmount = transactionRepository.getAverageAmount();
        Double maxAmount = transactionRepository.getMaxAmount();
        Double minAmount = transactionRepository.getMinAmount();
        Long uniqueUsers = transactionRepository.getUniqueUsersCount();

        return new TransactionStatsDTO(
                totalTransactions,
                totalAmount != null ? totalAmount : 0.0,
                avgAmount != null ? avgAmount : 0.0,
                maxAmount != null ? maxAmount : 0.0,
                minAmount != null ? minAmount : 0.0,
                uniqueUsers != null ? uniqueUsers : 0L
        );
    }

    public List<UserStatsDTO> getUserStatistics() {
        List<Object[]> results = transactionRepository.getUserStats();
        List<UserStatsDTO> stats = new ArrayList<>();

        for (Object[] row : results) {
            UserStatsDTO stat = new UserStatsDTO();
            stat.setUserId((Long) row[0]);
            stat.setUserName((String) row[1]);
            stat.setUserEmail((String) row[2]);
            stat.setTransactionCount((Long) row[3]);
            stat.setTotalSpent((Double) row[4]);
            stat.setAverageTransaction((Double) row[5]);
            stats.add(stat);
        }

        return stats;
    }

    private TransactionResponseDTO toResponseDTO(
            Transaction transaction
    ) {

        TransactionResponseDTO response =
                new TransactionResponseDTO();

        response.setId(transaction.getId());
        response.setType(transaction.getType());
        response.setAmount(transaction.getAmount());

        response.setOldBalanceOrig(
                transaction.getOldBalanceOrig()
        );

        response.setNewBalanceOrig(
                transaction.getNewBalanceOrig()
        );

        response.setOldBalanceDest(
                transaction.getOldBalanceDest()
        );

        response.setNewBalanceDest(
                transaction.getNewBalanceDest()
        );

        response.setPlace(transaction.getPlace());
        response.setDevice(transaction.getDevice());
        response.setTime(transaction.getTime());

        response.setUserId(
                transaction.getUser().getId()
        );

        // ML prediction
        response.setFraud(
                transaction.isFraud()
        );

        response.setFraudProbability(
                transaction.getFraudProbability()
        );

        response.setRiskLevel(
                transaction.getRiskLevel()
        );

        // Admin decision
        response.setAdminStatus(
                transaction.getAdminStatus()
        );

        return response;
    }
}