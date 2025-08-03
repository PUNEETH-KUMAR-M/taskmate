package com.taskmate.service.impl;

import com.taskmate.model.Task;
import com.taskmate.model.TaskStatus;
import com.taskmate.model.User;
import com.taskmate.repository.TaskRepository;
import com.taskmate.repository.UserRepository;
import com.taskmate.service.TaskService;
import com.taskmate.service.WebSocketService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;

    @Override
    public Task createTask(Task task, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        task.setAssignedTo(user);
        task.setStatus(TaskStatus.PENDING);
        
        Task savedTask = taskRepository.save(task);
        
        try {
            webSocketService.notifyTaskCreated(savedTask);
        } catch (Exception e) {
            // WebSocket notification failed, but task was created successfully
        }
        
        return savedTask;
    }

    @Override
    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByAssignedTo(user);
    }

    @Override
    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        TaskStatus newStatus = TaskStatus.valueOf(status.toUpperCase());
        task.setStatus(newStatus);

        Task updatedTask = taskRepository.save(task);
        webSocketService.notifyTaskStatusChanged(updatedTask);
        
        return updatedTask;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}
