package binh.shopee.dto.cart;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long itemId;
    private Long variantId;
    private Long productId;
    private String productName;
    private String attributesJson;
    private Integer quantity;
    private BigDecimal priceSnapshot;
    private BigDecimal discountSnapshot;
    private BigDecimal finalPrice;
    private BigDecimal lineTotal;
}
