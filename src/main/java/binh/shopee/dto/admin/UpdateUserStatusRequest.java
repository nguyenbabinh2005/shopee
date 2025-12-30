package binh.shopee.dto.admin;
import lombok.Data;
@Data
public class UpdateUserStatusRequest {
    private String status; // active, blocked
}