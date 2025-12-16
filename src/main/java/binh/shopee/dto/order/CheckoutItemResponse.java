package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutItemResponse {

    // ID của biến thể
    private Long variantId;

    // Tên sản phẩm (để hiển thị)
    private String productName;

    // Tên biến thể (ví dụ: "Màu Đỏ - Size M")
    private String attribution;
    private BigDecimal basePrice;          // giá gốc
    private BigDecimal itemDiscountTotal;     // discount campaign
    private BigDecimal discountedPrice;
    private Integer quantity;

    // Tổng tiền cho item = unitPrice * quantity
    private BigDecimal lineTotal;

    // Ảnh hiển thị
    private String imageUrl;
}
