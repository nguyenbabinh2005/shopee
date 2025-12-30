package binh.shopee.service;
import binh.shopee.dto.admin.UserAdminResponse;
import binh.shopee.entity.Users;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class AdminUsersService {

    private final UsersRepository usersRepository;
    public Page<UserAdminResponse> getUsers(int page, int size, String search, String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Users> users = usersRepository.findAll(pageable);

        return users.map(user -> {
            UserAdminResponse response = new UserAdminResponse();
            response.setUserId(user.getUserId());
            response.setUsername(user.getUsername());
            response.setName(user.getFullName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());
            response.setStatus(user.getStatus());
            response.setRole(user.getRole());
            response.setCreatedAt(user.getCreatedAt());
            response.setViolationCount(0); // TODO: Implement violation tracking
            return response;
        });
    }
    public UserAdminResponse getUserDetail(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAdminResponse response = new UserAdminResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setViolationCount(0);
        return response;
    }
    @Transactional
    public void updateUserStatus(Long id, String status) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        usersRepository.save(user);
    }
}