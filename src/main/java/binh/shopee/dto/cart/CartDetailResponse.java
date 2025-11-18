package binh.shopee.dto.cart;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDetailResponse {
    private Long cartId;
    private Long userId;
    private String sessionId;
    private Boolean isActive;
    private String currency;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;

}
