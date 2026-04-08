package com.taskmate.service;

import com.taskmate.model.Task;
import com.taskmate.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Async
    public void sendTaskAssignmentNotification(Task task, User assignee) {
        if (assignee.getEmail() == null || assignee.getEmail().isBlank()) {
            log.warn("Skipping task assignment email: no email for user id {}", assignee.getId());
            return;
        }
        if (fromAddress == null || fromAddress.isBlank()) {
            log.warn("Skipping task assignment email: spring.mail.username is not configured");
            return;
        }
        try {
            String recipientName = assignee.getName() != null && !assignee.getName().isBlank()
                    ? assignee.getName()
                    : assignee.getEmail();
            String title = task.getTitle() != null ? task.getTitle() : "(no title)";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(assignee.getEmail());
            message.setSubject("TaskMate: New task assigned to you");
            message.setText(String.format(
                    "Hello %s,%n%nYou have been assigned a new task: \"%s\".%n%n"
                            + "Please sign in to TaskMate to view the full details and update its status.%n%n"
                            + "— TaskMate",
                    recipientName,
                    title));

            javaMailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send task assignment email to {}", assignee.getEmail(), e);
        }
    }
}
