package binh.shopee.dto.authenticate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Long cartId;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
}