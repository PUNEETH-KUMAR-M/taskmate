package com.taskmate.service; // 🛑 This was missing

import com.taskmate.model.User;
import java.util.Optional;

public interface UserService {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email); // 🔥 Add this
    User saveUser(User user);

}
