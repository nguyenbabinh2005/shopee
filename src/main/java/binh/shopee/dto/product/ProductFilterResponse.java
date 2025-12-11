package binh.shopee.dto.product;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFilterResponse {

    private Long productId;
    private String name;
    private BigDecimal price;

    private boolean hasDiscount;
    private BigDecimal finalPrice;
    private Double avgRating;
}
