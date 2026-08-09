package com.example.frauddetector.exception;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidation(
                        MethodArgumentNotValidException exception) {

                Map<String, String> errors = exception.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .collect(Collectors.toMap(
                                                FieldError::getField,
                                                FieldError::getDefaultMessage));

                ErrorResponse error = new ErrorResponse(
                                400,
                                "Validation failed",
                                errors);

                return ResponseEntity
                                .status(400)
                                .body(error);
        }

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(
                        ResourceNotFoundException exception) {

                ErrorResponse error = new ErrorResponse(
                                404,
                                exception.getMessage());

                return ResponseEntity
                                .status(404)
                                .body(error);
        }

        @ExceptionHandler(InvalidAmountException.class)
        public ResponseEntity<ErrorResponse> handleInvalidAmount(
                        InvalidAmountException exception) {

                ErrorResponse error = new ErrorResponse(
                                400,
                                exception.getMessage());

                return ResponseEntity
                                .status(400)
                                .body(error);
        }
}