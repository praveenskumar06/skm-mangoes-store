package com.skmstore.service;

import com.skmstore.exception.BusinessException;
import com.skmstore.exception.ResourceNotFoundException;
import com.skmstore.model.Role;
import com.skmstore.model.User;
import com.skmstore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByPhone(String phone) {
        return userRepository.findByPhone(phone)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateProfile(Long userId, String name, String email) {
        User user = getUserById(userId);
        if (name != null && !name.isBlank()) {
            user.setName(name);
        }
        if (email != null) {
            user.setEmail(email);
        }
        return userRepository.save(user);
    }

    @Transactional
    public void promoteToAdmin(Long userId) {
        User user = getUserById(userId);
        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new BusinessException("User is already an admin");
        }
        user.setRole(Role.ROLE_ADMIN);
        userRepository.save(user);
    }

    @Transactional
    public void deactivateUser(Long userId) {
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void activateUser(Long userId) {
        User user = getUserById(userId);
        user.setActive(true);
        userRepository.save(user);
    }
}
