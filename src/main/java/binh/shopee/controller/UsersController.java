package binh.shopee.controller;
import binh.shopee.dto.authenticate.LoginRequest;
import binh.shopee.dto.authenticate.LoginResponse;
import binh.shopee.entity.Carts;
import binh.shopee.entity.Users;
import binh.shopee.repository.CartsRepository;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UsersController {
    private final AuthenticationManager authenticationManager;
    private final CartsRepository cartsRepository;
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {
        try {
            // 1️⃣ Xác thực username/password
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            // 2️⃣ Lấy CustomUserDetails từ authentication
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            Long userId = userDetails.getUser().getUserId();

            Carts cart = cartsRepository.findByUser_UserIdAndIsActiveTrue(userId)
                    .orElseThrow(() -> new RuntimeException("User chưa có cart active"));

            // 3️⃣ Lấy thông tin user đầy đủ
            Users user = userDetails.getUser();

            // 4️⃣ Trả về LoginResponse với đầy đủ thông tin
            LoginResponse response = LoginResponse.builder()
                    .cartId(cart.getCartId())
                    .userId(userId)
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(user.getRole())
                    .status(user.getStatus())
                    .build();
            return ResponseEntity.ok(response);
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(null);
        }
    }
}