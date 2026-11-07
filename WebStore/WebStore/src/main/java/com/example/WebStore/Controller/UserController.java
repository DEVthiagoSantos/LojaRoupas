package com.example.WebStore.Controller;

import com.example.WebStore.DTO.LoginDTO;
import com.example.WebStore.DTO.UserDTO;
import com.example.WebStore.DTO.UserResponseDTO;
import com.example.WebStore.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserDTO userDTO) {

        UserResponseDTO response = userService.createUser(userDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(
            @Valid @RequestBody LoginDTO loginDTO)
    {
        UserResponseDTO responseDTO
                = userService.login(loginDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity findUserById(
            @PathVariable Long id) {

        UserResponseDTO user = userService.findUserById(id);

        return ResponseEntity.ok(user);
    }
}
