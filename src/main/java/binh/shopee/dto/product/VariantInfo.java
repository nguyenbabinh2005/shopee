package binh.shopee.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariantInfo {
    private Long variantId;
    private String sku;
    private String attributesJson;
    private Double priceOverride;
    private String status;
    private LocalDateTime createdAt;
}
