package com.example.frauddetector.controller;

import com.example.frauddetector.dto.PaymentCardRequestDTO;
import com.example.frauddetector.dto.PaymentCardResponseDTO;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.exception.ResourceNotFoundException;
import com.example.frauddetector.repository.UserRepository;
import com.example.frauddetector.service.PaymentCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class PaymentCardController {

    private final PaymentCardService cardService;
    private final UserRepository userRepository;

    public PaymentCardController(PaymentCardService cardService, UserRepository userRepository) {
        this.cardService = cardService;
        this.userRepository = userRepository;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Object principal = auth.getPrincipal();

        if (principal instanceof User user) {
            return user.getId();
        }

        // fallback: principal is email string
        String email = principal.toString();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }

    @PostMapping
    public ResponseEntity<PaymentCardResponseDTO> addCard(@RequestBody PaymentCardRequestDTO dto) {
        return ResponseEntity.ok(cardService.addCard(dto, getCurrentUserId()));
    }

    @GetMapping
    public ResponseEntity<List<PaymentCardResponseDTO>> getMyCards() {
        return ResponseEntity.ok(cardService.getUserCards(getCurrentUserId()));
    }

    @GetMapping("/primary")
    public ResponseEntity<PaymentCardResponseDTO> getPrimaryCard() {
        PaymentCardResponseDTO card = cardService.getPrimaryCard(getCurrentUserId());
        if (card == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(card);
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long cardId) {
        cardService.deleteCard(cardId, getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
