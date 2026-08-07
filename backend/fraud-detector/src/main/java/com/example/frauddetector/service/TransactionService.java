package com.example.frauddetector.service;

import java.math.BigDecimal;
import java.util.List;

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
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        transaction.setUser(user);


        return transactionRepository.save(transaction);
    }


    public List<Transaction> getAllTransactions() {

        return transactionRepository.findAll();

    }


    public Transaction getTransactionById(Long id) {

        return transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found")
                );

    }


    public Transaction updateTransaction(
            Long id,
            Transaction updatedTransaction
    ) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found")
                );


        transaction.setAmount(updatedTransaction.getAmount());
        transaction.setPlace(updatedTransaction.getPlace());
        transaction.setDevice(updatedTransaction.getDevice());
        transaction.setTime(updatedTransaction.getTime());


        return transactionRepository.save(transaction);
    }


    public void deleteTransaction(Long id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Transaction not found")
                );
        transactionRepository.delete(transaction);
    }
}