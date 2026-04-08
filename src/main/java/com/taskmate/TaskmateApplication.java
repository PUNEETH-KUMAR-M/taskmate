package com.taskmate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class TaskmateApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskmateApplication.class, args);
	}

}
