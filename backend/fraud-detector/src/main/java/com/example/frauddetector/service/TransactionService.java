package com.example.frauddetector.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

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


    public Transaction createTransaction(
            Transaction transaction,
            Long userId
    ) {


        if (transaction.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be positive"
            );
        }


        User user = userRepository.findById(userId)
                .orElseThrow();


        transaction.setUser(user);


        return transactionRepository.save(transaction);
    }
}