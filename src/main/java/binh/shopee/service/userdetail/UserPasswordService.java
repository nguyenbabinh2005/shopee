package binh.shopee.service.userdetail;
import jakarta.annotation.PostConstruct;
import org.springframework.transaction.annotation.Transactional;
import binh.shopee.entity.Users;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserPasswordService {

    private final UsersRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @PostConstruct
    @Transactional
    public void encodeAllUserPasswords() {
        List<Users> users = userRepository.findAll();

        for (Users user : users) {
            String rawPassword = user.getPasswordHash();

            // Chỉ encode nếu password chưa phải là hash BCrypt
            if (!rawPassword.startsWith("$2a$") && !rawPassword.startsWith("$2b$") && !rawPassword.startsWith("$2y$")) {
                String hashed = passwordEncoder.encode(rawPassword);
                user.setPasswordHash(hashed);
            }
        }
        userRepository.saveAll(users);
    }
}