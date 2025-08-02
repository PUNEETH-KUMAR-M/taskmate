package com.taskmate.repository;

import com.taskmate.model.Token;
import com.taskmate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findAllByUser(User user);
}
