package com.example.WebStore.Service;

import com.example.WebStore.DTO.LoginDTO;
import com.example.WebStore.DTO.UserDTO;
import com.example.WebStore.DTO.UserResponseDTO;
import com.example.WebStore.Mapper.UserMapper;
import com.example.WebStore.model.Users;
import com.example.WebStore.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserDTO userDTO) {

        if (userRepository.existsByEmail(userDTO.email())) {
            throw new IllegalArgumentException(
                    "Este email já está cadastrado."
            );

        }

        Users user = userMapper.toEntity(userDTO);

        user.setSenha(
                passwordEncoder.encode(userDTO.senha())
        );

        Users savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    public UserResponseDTO findUserById(Long id) {

        Users user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado")
                );

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }

    public UserResponseDTO login(LoginDTO loginDTO) {

        Users user = userRepository.findByEmail(loginDTO.email())
                .orElseThrow(() ->
                        new RuntimeException("Email ou senha inválidos."));

        if (!passwordEncoder.matches(
                loginDTO.senha(),
                user.getSenha()
        )) {
            throw new RuntimeException(("Email ou senha inválidos."));
        }

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
