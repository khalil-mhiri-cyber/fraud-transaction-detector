package com.example.frauddetector.controller;

import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.dto.AuthResponseDTO;
import com.example.frauddetector.dto.LoginRequestDTO;
import com.example.frauddetector.dto.RegisterRequestDTO;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequestDTO dto) {
        return authService.register(dto);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return authService.login(dto);
    }

}