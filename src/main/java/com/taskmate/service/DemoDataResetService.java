package com.taskmate.service;

import com.taskmate.repository.TaskRepository;
import com.taskmate.repository.TokenRepository;
import com.taskmate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DemoDataResetService {

    private final TaskRepository taskRepository;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    public DemoDataResetService(TaskRepository taskRepository,
                                TokenRepository tokenRepository,
                                UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void resetAllData() {
        // Order matters due to FK constraints
        taskRepository.deleteAllInBatch();
        tokenRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();
    }
}
