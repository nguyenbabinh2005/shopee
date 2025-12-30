package binh.shopee.dto.admin;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class UserAdminResponse {
    private Long userId;
    private String username;
    private String name;
    private String email;
    private String phone;
    private String status;
    private String role;
    private LocalDateTime createdAt;
    private Integer violationCount;
}