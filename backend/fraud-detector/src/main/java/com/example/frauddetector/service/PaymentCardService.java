package com.example.frauddetector.service;

import com.example.frauddetector.dto.PaymentCardRequestDTO;
import com.example.frauddetector.dto.PaymentCardResponseDTO;
import com.example.frauddetector.entity.PaymentCard;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.exception.ResourceNotFoundException;
import com.example.frauddetector.repository.PaymentCardRepository;
import com.example.frauddetector.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentCardService {

    private final PaymentCardRepository cardRepository;
    private final UserRepository userRepository;

    public PaymentCardService(PaymentCardRepository cardRepository, UserRepository userRepository) {
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
    }

    public PaymentCardResponseDTO addCard(PaymentCardRequestDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<PaymentCard> existing = cardRepository.findByUserId(userId);

        PaymentCard card = new PaymentCard();
        // Store only last 4 digits
        String cardNum = dto.getCardNumber().replaceAll("\\s", "");
        card.setCardNumber(cardNum.substring(cardNum.length() - 4));
        card.setCardType(dto.getCardType() != null ? dto.getCardType().toUpperCase() : "VISA");
        card.setExpiryDate(dto.getExpiryDate());
        card.setBalance(dto.getBalance());
        card.setUser(user);
        // First card = primary
        card.setPrimary(existing.isEmpty());

        card = cardRepository.save(card);
        return toDTO(card);
    }

    public List<PaymentCardResponseDTO> getUserCards(Long userId) {
        return cardRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public PaymentCardResponseDTO getPrimaryCard(Long userId) {
        return cardRepository.findByUserIdAndPrimaryTrue(userId)
                .map(this::toDTO)
                .orElse(null);
    }

    public void deleteCard(Long cardId, Long userId) {
        PaymentCard card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        if (!card.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Card not found");
        }
        cardRepository.delete(card);
    }

    private PaymentCardResponseDTO toDTO(PaymentCard card) {
        PaymentCardResponseDTO dto = new PaymentCardResponseDTO();
        dto.setId(card.getId());
        dto.setLastFour(card.getCardNumber());
        dto.setCardType(card.getCardType());
        dto.setExpiryDate(card.getExpiryDate());
        dto.setBalance(card.getBalance());
        dto.setPrimary(card.isPrimary());
        return dto;
    }
}
