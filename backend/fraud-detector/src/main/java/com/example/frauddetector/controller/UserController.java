package com.example.frauddetector.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.dto.UserRequestDTO;
import com.example.frauddetector.dto.UserResponseDTO;
import com.example.frauddetector.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    
    @PostMapping("/users")
    public ResponseEntity<UserResponseDTO> createUser(
            @RequestBody UserRequestDTO userDTO
    ) {

        return ResponseEntity.ok(
                userService.createUser(userDTO)
        );
    }

    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO userDTO
    ) {

        return ResponseEntity.ok(
                userService.updateUser(id, userDTO)
        );
    }

 
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);

        return ResponseEntity.noContent().build();
    }
}