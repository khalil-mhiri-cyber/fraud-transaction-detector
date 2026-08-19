package com.example.frauddetector.controller;

import com.example.frauddetector.entity.*;
import com.example.frauddetector.service.CBSService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cbs")
public class CBSController {

    private final CBSService cbsService;

    public CBSController(CBSService cbsService) {
        this.cbsService = cbsService;
    }

    // ===== Identity Verification =====

    @PostMapping("/identity/submit")
    public ResponseEntity<IdentityVerification> submitIdentity(
            @RequestParam Long userId,
            @RequestBody IdentityVerification verification
    ) {
        return ResponseEntity.ok(cbsService.submitIdentityVerification(userId, verification));
    }

    @GetMapping("/identity/{userId}")
    public ResponseEntity<IdentityVerification> getIdentity(@PathVariable Long userId) {
        return ResponseEntity.ok(cbsService.getIdentityVerification(userId));
    }

    // ===== Bank Accounts =====

    @PostMapping("/accounts")
    public ResponseEntity<BankAccount> createAccount(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "CHECKING") String accountType
    ) {
        return ResponseEntity.ok(cbsService.createCustomerAccount(userId, accountType));
    }

    @GetMapping("/accounts/user/{userId}")
    public ResponseEntity<List<BankAccount>> getUserAccounts(@PathVariable Long userId) {
        return ResponseEntity.ok(cbsService.getUserAccounts(userId));
    }

    @GetMapping("/accounts/{userId}/primary")
    public ResponseEntity<BankAccount> getPrimaryAccount(@PathVariable Long userId) {
        return ResponseEntity.ok(cbsService.getPrimaryAccount(userId));
    }

    @PostMapping("/accounts/sync/{userId}")
    public ResponseEntity<List<BankAccount>> syncAccounts(@PathVariable Long userId) {
        return ResponseEntity.ok(cbsService.synchronizeAccounts(userId));
    }

    // ===== Bank Transfers =====

    @PostMapping("/transfers")
    public ResponseEntity<BankTransfer> executeTransfer(
            @RequestParam Long fromAccountId,
            @RequestBody BankTransfer transfer
    ) {
        return ResponseEntity.ok(cbsService.executeBankTransfer(fromAccountId, transfer));
    }

    @GetMapping("/transfers/account/{accountId}")
    public ResponseEntity<List<BankTransfer>> getTransferHistory(@PathVariable Long accountId) {
        return ResponseEntity.ok(cbsService.getTransferHistory(accountId));
    }

    @GetMapping("/transfers/account/{accountId}/period")
    public ResponseEntity<List<BankTransfer>> getTransferHistoryByPeriod(
            @PathVariable Long accountId,
            @RequestParam String start,
            @RequestParam String end
    ) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return ResponseEntity.ok(cbsService.getTransferHistoryByPeriod(accountId, startDate, endDate));
    }

    @PostMapping("/transfers/{transferId}/approve")
    public ResponseEntity<BankTransfer> approveTransfer(@PathVariable Long transferId) {
        return ResponseEntity.ok(cbsService.approveTransfer(transferId));
    }

    @PostMapping("/transfers/{transferId}/reject")
    public ResponseEntity<BankTransfer> rejectTransfer(
            @PathVariable Long transferId,
            @RequestBody Map<String, String> body
    ) {
        String reason = body.getOrDefault("reason", "Rejected by admin");
        return ResponseEntity.ok(cbsService.rejectTransfer(transferId, reason));
    }
}
