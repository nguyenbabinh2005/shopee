package binh.shopee.dto.cart;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartQuantityResponse {
    private Long cartId;        // ID giỏ hàng
    private Long variantId;     // ID sản phẩm/variant đang update
    private Integer quantity;   // Quantity mới
    private BigDecimal lineTotal; // Tổng tiền sản phẩm này (quantity * priceSnapshot)
    private BigDecimal totalAmount; // Tổng tiền giỏ hàng
}
