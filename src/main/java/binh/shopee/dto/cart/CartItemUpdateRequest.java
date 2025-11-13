package binh.shopee.dto.cart;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemUpdateRequest {
    private Long variantId;
    private Integer quantity;
}
