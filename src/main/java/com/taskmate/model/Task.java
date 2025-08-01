package com.taskmate.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    // 👇 Link to the User (assigned user)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User assignedTo;
}
