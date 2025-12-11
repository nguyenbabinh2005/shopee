package binh.shopee.dto.product;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFilterRequest {

    private Integer minPrice;
    private Integer maxPrice;

    private Boolean onDiscount;   // true = chỉ lấy sản phẩm đang giảm giá
    private Integer minRating;    // 1–5 sao
}
