package com.example.frauddetector.service;

import com.example.frauddetector.entity.*;
import com.example.frauddetector.repository.*;
import com.example.frauddetector.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class CBSService {

    private final BankAccountRepository bankAccountRepository;
    private final BankTransferRepository bankTransferRepository;
    private final IdentityVerificationRepository identityVerificationRepository;
    private final UserRepository userRepository;
    private final FraudDetectionService fraudDetectionService;
    private final Random random = new Random();

    public CBSService(
            BankAccountRepository bankAccountRepository,
            BankTransferRepository bankTransferRepository,
            IdentityVerificationRepository identityVerificationRepository,
            UserRepository userRepository,
            FraudDetectionService fraudDetectionService
    ) {
        this.bankAccountRepository = bankAccountRepository;
        this.bankTransferRepository = bankTransferRepository;
        this.identityVerificationRepository = identityVerificationRepository;
        this.userRepository = userRepository;
        this.fraudDetectionService = fraudDetectionService;
    }

    // 1. Verify identity during registration
    @Transactional
    public IdentityVerification submitIdentityVerification(Long userId, IdentityVerification verification) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if already verified
        if (identityVerificationRepository.existsByUserId(userId)) {
            throw new IllegalStateException("Identity already submitted for this user");
        }

        // Check if ID number already used
        if (identityVerificationRepository.existsByIdNumber(verification.getIdNumber())) {
            throw new IllegalStateException("This ID number is already registered");
        }

        verification.setUser(user);
        verification.setVerificationStatus("PENDING");
        verification.setSubmittedAt(LocalDateTime.now());

        // Auto-verify for demo (in production, this would be manual or use external KYC API)
        if (isValidIdentity(verification)) {
            verification.setVerificationStatus("VERIFIED");
            verification.setVerificationMethod("AUTOMATED");
            verification.setVerifiedAt(LocalDateTime.now());
            verification.setVerifiedBy("SYSTEM");
        }

        return identityVerificationRepository.save(verification);
    }

    // 2. Integrate new customer (direct subscription)
    @Transactional
    public BankAccount createCustomerAccount(Long userId, String accountType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if identity is verified
        IdentityVerification identity = identityVerificationRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Identity not verified. Please complete KYC first."));

        if (!"VERIFIED".equals(identity.getVerificationStatus())) {
            throw new IllegalStateException("Identity not yet verified. Please wait for verification.");
        }

        // Generate account number and IBAN
        String accountNumber = generateAccountNumber();
        String iban = generateIBAN(accountNumber);

        // Check if user already has a primary account
        boolean hasPrimary = bankAccountRepository.findByUserIdAndIsPrimaryTrue(userId).isPresent();

        BankAccount account = new BankAccount();
        account.setUser(user);
        account.setAccountNumber(accountNumber);
        account.setAccountType(accountType);
        account.setBalance(BigDecimal.ZERO);
        account.setCurrency("DT");
        account.setStatus("ACTIVE");
        account.setIban(iban);
        account.setBankName("Central Bank of Tunisia");
        account.setBranchCode("CBT" + String.format("%03d", random.nextInt(1000)));
        account.setIsPrimary(!hasPrimary); // First account is primary
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());

        System.out.println("✅ New customer account created: " + accountNumber);
        return bankAccountRepository.save(account);
    }

    // 3. Synchronize accounts and banking profiles
    @Transactional
    public List<BankAccount> synchronizeAccounts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // In production, this would call external bank API to sync accounts
        // For now, we just return existing accounts
        List<BankAccount> accounts = bankAccountRepository.findByUserId(userId);

        // Update all account balances and statuses
        for (BankAccount account : accounts) {
            account.setUpdatedAt(LocalDateTime.now());
            // In production: fetch real balance from core banking system
            bankAccountRepository.save(account);
        }

        System.out.println("✅ Synchronized " + accounts.size() + " accounts for user " + userId);
        return accounts;
    }

    // 4. Retrieve transfer history
    public List<BankTransfer> getTransferHistory(Long accountId) {
        if (!bankAccountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Bank account not found");
        }
        return bankTransferRepository.findByFromAccountIdOrderByInitiatedAtDesc(accountId);
    }

    public List<BankTransfer> getTransferHistoryByPeriod(Long accountId, LocalDateTime start, LocalDateTime end) {
        if (!bankAccountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Bank account not found");
        }
        return bankTransferRepository.findByFromAccountIdAndInitiatedAtBetween(accountId, start, end);
    }

    // 5. Execute bank transfer
    @Transactional
    public BankTransfer executeBankTransfer(Long fromAccountId, BankTransfer transfer) {
        BankAccount fromAccount = bankAccountRepository.findById(fromAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found"));

        // Check account status
        if (!"ACTIVE".equals(fromAccount.getStatus())) {
            throw new IllegalStateException("Source account is not active");
        }

        // Check sufficient balance
        BigDecimal totalAmount = transfer.getAmount().add(transfer.getFees());
        if (fromAccount.getBalance().compareTo(totalAmount) < 0) {
            throw new IllegalStateException("Insufficient balance");
        }

        // Set transfer details
        transfer.setFromAccount(fromAccount);
        transfer.setStatus("PROCESSING");
        transfer.setReference("TRF-" + System.currentTimeMillis());
        transfer.setInitiatedAt(LocalDateTime.now());

        // Fraud detection - simulate transaction for ML analysis
        try {
            // In production: call fraud detection with transfer details
            boolean isSuspicious = transfer.getAmount().compareTo(new BigDecimal("50000")) > 0;
            transfer.setIsFraud(isSuspicious);
            transfer.setFraudProbability(isSuspicious ? new BigDecimal("0.85") : new BigDecimal("0.15"));
            transfer.setRiskLevel(isSuspicious ? "HIGH" : "LOW");

            if (isSuspicious) {
                transfer.setStatus("PENDING"); // Requires admin approval
                System.out.println("🚨 Suspicious transfer detected - amount: " + transfer.getAmount());
            }
        } catch (Exception e) {
            System.err.println("Fraud detection failed: " + e.getMessage());
        }

        // Save transfer
        transfer = bankTransferRepository.save(transfer);

        // If not suspicious, execute immediately
        if (!"PENDING".equals(transfer.getStatus())) {
            executeTransferImmediately(transfer, fromAccount);
        }

        return transfer;
    }

    @Transactional
    public void executeTransferImmediately(BankTransfer transfer, BankAccount fromAccount) {
        try {
            // Deduct from source account
            BigDecimal newBalance = fromAccount.getBalance()
                    .subtract(transfer.getAmount())
                    .subtract(transfer.getFees());
            fromAccount.setBalance(newBalance);
            fromAccount.setUpdatedAt(LocalDateTime.now());
            bankAccountRepository.save(fromAccount);

            // In production: credit destination account via RTGS/SEPA/SWIFT

            // Update transfer status
            transfer.setStatus("COMPLETED");
            transfer.setCompletedAt(LocalDateTime.now());
            bankTransferRepository.save(transfer);

            System.out.println("✅ Transfer executed: " + transfer.getAmount() + " DT to " + transfer.getBeneficiaryName());
        } catch (Exception e) {
            transfer.setStatus("FAILED");
            transfer.setFailureReason(e.getMessage());
            bankTransferRepository.save(transfer);
            throw new RuntimeException("Transfer failed: " + e.getMessage());
        }
    }

    // Helper methods
    private String generateAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "TN" + String.format("%012d", random.nextLong() % 1000000000000L);
        } while (bankAccountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private String generateIBAN(String accountNumber) {
        return "TN59" + accountNumber + String.format("%02d", random.nextInt(100));
    }

    private boolean isValidIdentity(IdentityVerification verification) {
        // Basic validation
        if (verification.getIdNumber() == null || verification.getIdNumber().length() < 8) {
            return false;
        }
        if (verification.getDateOfBirth() == null) {
            return false;
        }
        // Check age >= 18
        int age = LocalDateTime.now().getYear() - verification.getDateOfBirth().getYear();
        return age >= 18;
    }

    // Get account by user
    public List<BankAccount> getUserAccounts(Long userId) {
        return bankAccountRepository.findByUserId(userId);
    }

    public BankAccount getPrimaryAccount(Long userId) {
        return bankAccountRepository.findByUserIdAndIsPrimaryTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No primary account found"));
    }

    // Get identity verification status
    public IdentityVerification getIdentityVerification(Long userId) {
        return identityVerificationRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Identity verification not found"));
    }

    // Admin: Approve/Reject pending transfers
    @Transactional
    public BankTransfer approveTransfer(Long transferId) {
        BankTransfer transfer = bankTransferRepository.findById(transferId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found"));

        if (!"PENDING".equals(transfer.getStatus())) {
            throw new IllegalStateException("Transfer is not pending");
        }

        BankAccount fromAccount = transfer.getFromAccount();
        executeTransferImmediately(transfer, fromAccount);

        return transfer;
    }

    @Transactional
    public BankTransfer rejectTransfer(Long transferId, String reason) {
        BankTransfer transfer = bankTransferRepository.findById(transferId)
                .orElseThrow(() -> new ResourceNotFoundException("Transfer not found"));

        if (!"PENDING".equals(transfer.getStatus())) {
            throw new IllegalStateException("Transfer is not pending");
        }

        transfer.setStatus("CANCELLED");
        transfer.setFailureReason(reason);
        transfer.setCompletedAt(LocalDateTime.now());

        return bankTransferRepository.save(transfer);
    }
}
