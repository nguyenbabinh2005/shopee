package binh.shopee.repository;

import binh.shopee.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByUserId(Long userId);
    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

}