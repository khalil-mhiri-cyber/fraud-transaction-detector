package com.example.frauddetector.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.entity.Transaction;
import com.example.frauddetector.service.TransactionService;

import java.util.List;


@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionService transactionService;


    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }


    
    @PostMapping("/transactions/{userId}")
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Transaction transaction,
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                transactionService.createTransaction(transaction, userId)
        );
    }


    
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions()
        );
    }


    
    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                transactionService.getTransactionById(id)
        );
    }


    
    @PutMapping("/transactions/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction
    ) {

        return ResponseEntity.ok(
                transactionService.updateTransaction(id, transaction)
        );
    }


    
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id
    ) {

        transactionService.deleteTransaction(id);

        return ResponseEntity.noContent().build();
    }

}