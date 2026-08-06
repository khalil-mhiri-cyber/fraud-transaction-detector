package com.example.frauddetector.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.frauddetector.entity.User;

public interface UserRepository 
        extends JpaRepository<User, Long> {

}