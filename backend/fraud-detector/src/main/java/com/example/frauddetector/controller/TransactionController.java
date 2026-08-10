package com.example.frauddetector.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.dto.TransactionRequestDTO;
import com.example.frauddetector.dto.TransactionResponseDTO;
import com.example.frauddetector.service.TransactionService;

@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService
    ) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transactions/{userId}")
    public ResponseEntity<TransactionResponseDTO> createTransaction(
            @RequestBody TransactionRequestDTO transactionDTO,
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                transactionService.createTransaction(
                        transactionDTO,
                        userId
                )
        );
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionResponseDTO>>
            getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions()
        );
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<TransactionResponseDTO>
            getTransactionById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                transactionService.getTransactionById(id)
        );
    }
}