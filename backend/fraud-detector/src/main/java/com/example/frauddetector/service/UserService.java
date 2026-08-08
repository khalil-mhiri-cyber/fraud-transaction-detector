package com.example.frauddetector.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.frauddetector.dto.UserRequestDTO;
import com.example.frauddetector.dto.UserResponseDTO;
import com.example.frauddetector.entity.User;
import com.example.frauddetector.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    
    public UserResponseDTO createUser(UserRequestDTO userDTO) {

        if (userDTO.getEmail() == null ||
                userDTO.getEmail().isEmpty()) {

            throw new RuntimeException("Email required");
        }

        User user = new User();

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        user = userRepository.save(user);

        return toResponseDTO(user);
    }

    // Get All
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Get By ID
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return toResponseDTO(user);
    }

    // Update
    public UserResponseDTO updateUser(
            Long id,
            UserRequestDTO userDTO
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        user = userRepository.save(user);

        return toResponseDTO(user);
    }

    // Delete
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        userRepository.delete(user);
    }

    
    private UserResponseDTO toResponseDTO(User user) {

        UserResponseDTO response = new UserResponseDTO();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        return response;
    }
}