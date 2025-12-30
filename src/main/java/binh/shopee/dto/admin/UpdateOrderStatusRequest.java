package binh.shopee.dto.admin;
import lombok.Data;
@Data
public class UpdateOrderStatusRequest {
    private String status; // pending, processing, shipping, completed, canceled
}