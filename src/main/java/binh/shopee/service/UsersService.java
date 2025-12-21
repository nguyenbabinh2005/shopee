package binh.shopee.service;

import binh.shopee.entity.Users;
import binh.shopee.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsersService {
    private final UsersRepository usersRepository;
    public Users getUserByUserId(Long userId) {
        return usersRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại với userId: " + userId));
    }
}