package com.taskmate.service;

import com.taskmate.model.Task;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyTaskCreated(Task task) {
        messagingTemplate.convertAndSend("/topic/tasks", task);
        if (task.getAssignedTo() != null) {
            messagingTemplate.convertAndSend("/queue/user/" + task.getAssignedTo().getId(), task);
        }
    }

    public void notifyTaskUpdated(Task task) {
        messagingTemplate.convertAndSend("/topic/tasks", task);
        if (task.getAssignedTo() != null) {
            messagingTemplate.convertAndSend("/queue/user/" + task.getAssignedTo().getId(), task);
        }
    }

    public void notifyTaskStatusChanged(Task task) {
        messagingTemplate.convertAndSend("/topic/task-status", task);
        if (task.getAssignedTo() != null) {
            messagingTemplate.convertAndSend("/queue/user/" + task.getAssignedTo().getId(), task);
        }
    }
} 