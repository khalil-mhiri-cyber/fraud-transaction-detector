package com.example.frauddetector.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.frauddetector.dto.TransactionRequestDTO;
import com.example.frauddetector.dto.TransactionResponseDTO;
import com.example.frauddetector.entity.Transaction;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.repository.TransactionRepository;
import com.example.frauddetector.repository.UserRepository;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // Create Transaction
    public TransactionResponseDTO createTransaction(
            TransactionRequestDTO transactionDTO,
            Long userId
    ) {

        if (transactionDTO.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be positive"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Transaction transaction = new Transaction();

        transaction.setAmount(transactionDTO.getAmount());
        transaction.setPlace(transactionDTO.getPlace());
        transaction.setDevice(transactionDTO.getDevice());
        transaction.setTime(transactionDTO.getTime());

        transaction.setUser(user);

        transaction = transactionRepository.save(transaction);

        return toResponseDTO(transaction);
    }

    // Get All
    public List<TransactionResponseDTO> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Get By ID
    public TransactionResponseDTO getTransactionById(Long id) {

        Transaction transaction =
                transactionRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found"
                                )
                        );

        return toResponseDTO(transaction);
    }

    // Entity → Response DTO
    private TransactionResponseDTO toResponseDTO(
            Transaction transaction
    ) {

        TransactionResponseDTO response =
                new TransactionResponseDTO();

        response.setId(transaction.getId());
        response.setAmount(transaction.getAmount());
        response.setPlace(transaction.getPlace());
        response.setDevice(transaction.getDevice());
        response.setTime(transaction.getTime());

        response.setUserId(
                transaction.getUser().getId()
        );

        return response;
    }
}