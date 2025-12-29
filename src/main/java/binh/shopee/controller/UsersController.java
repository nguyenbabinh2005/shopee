package binh.shopee.controller;

import binh.shopee.dto.auth.RegisterRequest;
import binh.shopee.dto.authenticate.LoginRequest;
import binh.shopee.dto.authenticate.LoginResponse;
import binh.shopee.dto.user.UserUpdateRequest;
import binh.shopee.entity.Carts;
import binh.shopee.entity.Users;
import binh.shopee.repository.CartsRepository;
import binh.shopee.service.UsersService;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    private final UsersService usersService;

    @PatchMapping("/{id}")
    public Users updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateRequest request
    ) {
        return usersService.updateUser(id, request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody RegisterRequest request) {
        usersService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest loginRequest
    ) {
        try {
            // 1️⃣ Authenticate
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // 2️⃣ Lấy user
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            Users user = userDetails.getUser();
            Long userId = user.getUserId();

            Carts cart = cartsRepository
                    .findByUser_UserIdAndIsActiveTrue(userId)
                    .orElseThrow(() -> new RuntimeException("User chưa có cart active"));

            // 5️⃣ Response
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

}