package binh.shopee.dto.admin;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class OrderAdminResponse {
    private Long orderId;
    private String orderNumber;
    private String customerName;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private Integer itemCount;
}