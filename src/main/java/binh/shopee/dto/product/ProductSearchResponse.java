package binh.shopee.dto.product;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchResponse {

    private Long productId;

    private String name;
    private BigDecimal originalPrice;   // giá gốc

    private BigDecimal discountAmount;   // số tiền giảm (VD: 20000)

    private BigDecimal finalPrice;        // giá sau giảm

    private String imageUrl;
    private Long totalPurchaseCount;
    private Double rating;

}
