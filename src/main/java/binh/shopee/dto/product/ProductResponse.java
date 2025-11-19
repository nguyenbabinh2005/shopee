package binh.shopee.dto.product;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long productId;
    private String name;
    private BigDecimal price;
    private String primaryImageUrl;
    private Long totalPurchaseCount;
}
