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
    private String slug;
    private BigDecimal price;
    private String imageUrl;  // ảnh đại diện (image primary)
}
