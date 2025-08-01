package com.taskmate.service;

import com.taskmate.model.Task;
import com.taskmate.model.User;

import java.util.List;

public interface TaskService {
    Task createTask(Task task, Long userId);
    List<Task> getTasksByUser(User user);
    Task updateTaskStatus(Long taskId, String status);
    List<Task> getAllTasks(); // for admin
}
