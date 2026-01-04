package binh.shopee.dto.order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long orderItemId;
    private String productName;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private Long productId;
    private Long variantId;
    private Boolean canReview;
    private Boolean hasReviewed;
    
    // ✅ THÊM: Field để hiển thị ảnh sản phẩm
    private String imageUrl;
}
