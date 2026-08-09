package com.example.frauddetector.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.frauddetector.dto.TransactionRequestDTO;
import com.example.frauddetector.dto.TransactionResponseDTO;
import com.example.frauddetector.entity.Transaction;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.exception.InvalidAmountException;
import com.example.frauddetector.exception.ResourceNotFoundException;
import com.example.frauddetector.repository.TransactionRepository;
import com.example.frauddetector.repository.UserRepository;
import com.example.frauddetector.exception.ResourceNotFoundException;
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
                        new ResourceNotFoundException("User not found")
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
                                new ResourceNotFoundException("Transaction not found")
                        );

        return toResponseDTO(transaction);
    }

    
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