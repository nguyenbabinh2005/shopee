package binh.shopee.controller;
import binh.shopee.dto.admin.UserAdminResponse;
import binh.shopee.dto.admin.UpdateUserStatusRequest;
import binh.shopee.service.AdminUsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminUsersController {

    private final AdminUsersService adminUsersService;
    @GetMapping
    public ResponseEntity<Page<UserAdminResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(adminUsersService.getUsers(page, size, search, status));
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserAdminResponse> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminUsersService.getUserDetail(id));
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request
    ) {
        adminUsersService.updateUserStatus(id, request.getStatus());
        return ResponseEntity.ok().build();
    }
}