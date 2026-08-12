package com.example.frauddetector.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.dto.TransactionRequestDTO;
import com.example.frauddetector.dto.TransactionResponseDTO;
import com.example.frauddetector.entity.User;
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

    @PostMapping("/transactions")
    public ResponseEntity<TransactionResponseDTO> createTransaction(
            @RequestBody TransactionRequestDTO transactionDTO
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        User user = (User) authentication.getPrincipal();

        Long userId = user.getId();

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