package com.example.frauddetector.controller;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.dto.TransactionRequestDTO;
import com.example.frauddetector.dto.TransactionResponseDTO;
import com.example.frauddetector.dto.TransactionStatsDTO;
import com.example.frauddetector.dto.UserStatsDTO;
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
            @Valid @RequestBody TransactionRequestDTO transactionDTO
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

    // Stats endpoints
    @GetMapping("/transactions/stats")
    public ResponseEntity<TransactionStatsDTO> getStatistics() {
        return ResponseEntity.ok(
                transactionService.getStatistics()
        );
    }

    @GetMapping("/transactions/stats/users")
    public ResponseEntity<List<UserStatsDTO>> getUserStatistics() {
        return ResponseEntity.ok(
                transactionService.getUserStatistics()
        );
    }

    // Get by user
    @GetMapping("/transactions/user/{userId}")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionsByUser(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                transactionService.getTransactionsByUserId(userId)
        );
    }

    // Search endpoints
    @GetMapping("/transactions/search/place")
    public ResponseEntity<List<TransactionResponseDTO>> searchByPlace(
            @RequestParam String place
    ) {
        return ResponseEntity.ok(
                transactionService.searchByPlace(place)
        );
    }

    @GetMapping("/transactions/search/device")
    public ResponseEntity<List<TransactionResponseDTO>> searchByDevice(
            @RequestParam String device
    ) {
        return ResponseEntity.ok(
                transactionService.searchByDevice(device)
        );
    }

    // Filter endpoints
    @GetMapping("/transactions/filter/amount")
    public ResponseEntity<List<TransactionResponseDTO>> filterByAmount(
            @RequestParam Double min,
            @RequestParam Double max
    ) {
        return ResponseEntity.ok(
                transactionService.getTransactionsByAmountRange(min, max)
        );
    }

    @GetMapping("/transactions/high-value")
    public ResponseEntity<List<TransactionResponseDTO>> getHighValueTransactions(
            @RequestParam(defaultValue = "1000.0") Double threshold
    ) {
        return ResponseEntity.ok(
                transactionService.getHighValueTransactions(threshold)
        );
    }

    @GetMapping("/transactions/filter/date")
    public ResponseEntity<List<TransactionResponseDTO>> filterByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(
                transactionService.getTransactionsByDateRange(startDate, endDate)
        );
    }
}