package com.example.frauddetector.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final String secret =
            "my-super-secret-key-for-fraud-detector-application-123456";

    private final long expiration = 1000 * 60 * 60; // 1 hour

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(String email) {
    Date now = new Date();

    Date expirationDate =
            new Date(now.getTime() + expiration);

    return Jwts.builder()
            .subject(email)
            .issuedAt(now)
            .expiration(expirationDate)
            .signWith(getSigningKey())
            .compact();
}

public String extractEmail(String token) {
    return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
}
}