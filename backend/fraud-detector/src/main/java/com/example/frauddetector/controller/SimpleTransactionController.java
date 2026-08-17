package com.example.frauddetector.controller;

import com.example.frauddetector.entity.SimpleTransaction;
import com.example.frauddetector.repository.SimpleTransactionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/simple-transactions")
@CrossOrigin(origins = "*")
public class SimpleTransactionController {

    private final SimpleTransactionRepository repository;

    public SimpleTransactionController(SimpleTransactionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<SimpleTransaction>> getAllTransactions() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SimpleTransaction> getTransactionById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(repository.count());
    }
}
