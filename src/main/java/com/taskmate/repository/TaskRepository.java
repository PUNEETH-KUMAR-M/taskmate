package com.taskmate.repository;

import com.taskmate.model.Task;
import com.taskmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
}
