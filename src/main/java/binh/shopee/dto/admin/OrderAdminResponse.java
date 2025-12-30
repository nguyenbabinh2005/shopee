package binh.shopee.dto.admin;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Data
public class OrderAdminResponse {
    private Long orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private BigDecimal totalAmount;        // This is SUBTOTAL (sum of items)
    private BigDecimal shippingFee;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;        // This is GRAND TOTAL (after shipping & discount)
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer itemCount;
    private List<OrderItemDTO> items;      // For detail view
    private String note;

    @Data
    public static class OrderItemDTO {
        private Long productId;
        private String productName;
        private String imageUrl;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalPrice;     // price * quantity
    }
}
