package binh.shopee.controller;
import binh.shopee.dto.authenticate.LoginRequest;
import binh.shopee.dto.authenticate.LoginResponse;
import binh.shopee.dto.product.ProductResponse;
import binh.shopee.service.ProductsService;

import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UsersController {

    private final AuthenticationManager authenticationManager;
    private final ProductsService productService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse<Long>> login(
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

            // 3️⃣ Trả về LoginResponse với userId
            LoginResponse<Long> response = LoginResponse.<Long>builder()
                    .statusCode(200)
                    .success(true)
                    .message("Login successful")
                    .data(userId)   // 👈 userId trả về FE
                    .build();

            return ResponseEntity.ok(response);

        } catch (AuthenticationException ex) {
            LoginResponse<Long> response = LoginResponse.<Long>builder()
                    .statusCode(401)
                    .success(false)
                    .message("Invalid username or password")
                    .data(null)
                    .build();
            return ResponseEntity.status(401).body(response);
        }
    }

}
