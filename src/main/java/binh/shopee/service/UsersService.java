package binh.shopee.service;
import binh.shopee.repository.CartsRepository;
import org.springframework.util.StringUtils;
import binh.shopee.dto.auth.RegisterRequest;
import binh.shopee.dto.user.UserUpdateRequest;
import binh.shopee.entity.Carts;
import binh.shopee.entity.Users;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class UsersService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartsRepository cartsRepository;
    @Transactional
    public Users updateUser(Long userId, UserUpdateRequest request) {

        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName());
        }

        if (StringUtils.hasText(request.getPhone())) {
            user.setPhone(request.getPhone());
        }

        if (StringUtils.hasText(request.getEmail())) {
            user.setEmail(request.getEmail());
        }

        // KHÔNG cần usersRepository.save(user)
        // Hibernate dirty checking sẽ tự update
        return user;
    }

    public void register(RegisterRequest request) {

        // 1. Check email
        if (usersRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // 2. Check username
        if (usersRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        // 3. Build entity
        Users user = Users.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role("customer")
                .status("active")
                .build();
        // 4. Save
        usersRepository.save(user);
        Carts carts = new Carts();
        carts.setUser(user);
        cartsRepository.save(carts);
    }
}