package com.example.frauddetector.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.frauddetector.entity.User;
import com.example.frauddetector.service.UserService;

import java.util.List;


@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/users")
    public ResponseEntity<User> createUser(
            @RequestBody User user
    ) {

        return ResponseEntity.ok(
                userService.createUser(user)
        );
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


   
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ) {

        return ResponseEntity.ok(
                userService.updateUser(id, user)
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