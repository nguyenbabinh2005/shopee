package binh.shopee.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariantInfo {
    private Long productId;        // ID của product
    private String productName;    // Tên product
    private Long variantId;
    private String sku;
    private Integer quantity;
    private String attributesJson;
    private BigDecimal priceOverride;
    private String imageUrl;
    private String status;
    private LocalDateTime createdAt;
}
