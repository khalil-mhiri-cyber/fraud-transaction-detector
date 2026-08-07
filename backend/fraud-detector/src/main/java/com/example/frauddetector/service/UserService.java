package com.example.frauddetector.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.frauddetector.entity.User;
import com.example.frauddetector.repository.UserRepository;


@Service
public class UserService {


    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // Create User
    public User createUser(User user) {

        if(user.getEmail() == null || user.getEmail().isEmpty()) {

            throw new RuntimeException("Email required");

        }

        return userRepository.save(user);
    }


    // Get All Users
    public List<User> getAllUsers() {

        return userRepository.findAll();

    }


    // Get User By Id
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

    }


    // Update User
    public User updateUser(
            Long id,
            User updatedUser
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());


        return userRepository.save(user);
    }


    // Delete User
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        userRepository.delete(user);

    }

}