package binh.shopee.dto.product;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private Long brandId;
    private Long productId;// FK → Brands
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private String status;         // "active" | "inactive"
}
