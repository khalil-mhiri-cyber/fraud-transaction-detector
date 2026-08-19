package com.example.frauddetector.controller;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simple")
public class SimpleTransactionController {

    private final DataSource dataSource;

    public SimpleTransactionController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Map<String, Object>>> getAllTransactionsDirectly() {
        List<Map<String, Object>> transactions = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(
                 "SELECT id, amount, type, device, place, time, " +
                 "is_fraud, fraud_probability, risk_level, admin_status " +
                 "FROM transactions ORDER BY id DESC LIMIT 1000"
             )) {
            
            while (rs.next()) {
                Map<String, Object> tx = new HashMap<>();
                tx.put("id", rs.getLong("id"));
                tx.put("amount", rs.getBigDecimal("amount"));
                tx.put("type", rs.getString("type"));
                tx.put("device", rs.getString("device"));
                tx.put("place", rs.getString("place"));
                tx.put("time", rs.getTimestamp("time"));
                tx.put("is_fraud", rs.getBoolean("is_fraud"));
                tx.put("fraud_probability", rs.getBigDecimal("fraud_probability"));
                tx.put("risk_level", rs.getString("risk_level"));
                tx.put("admin_status", rs.getString("admin_status"));
                transactions.add(tx);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(transactions);
    }
}
