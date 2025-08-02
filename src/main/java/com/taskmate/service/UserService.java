package com.taskmate.service;

import com.taskmate.dto.UserProfileRequest;
import com.taskmate.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User saveUser(User user);
    List<User> getAllUsers();
    User updateProfile(String email, UserProfileRequest request);
    User getUserProfile(String email);
}
