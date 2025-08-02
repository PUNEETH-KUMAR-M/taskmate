package com.taskmate.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileRequest {
    private String name;
    private String email;
    private String currentPassword;
    private String newPassword;
} 