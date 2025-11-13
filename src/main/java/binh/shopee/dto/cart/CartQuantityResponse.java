package binh.shopee.dto.cart;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartQuantityResponse {
    private Long variantId;      // ID sản phẩm/variant đang update
    private Integer quantity;    // Quantity mới
    private BigDecimal totalAmount; // Tổng tiền giỏ hàng
}
