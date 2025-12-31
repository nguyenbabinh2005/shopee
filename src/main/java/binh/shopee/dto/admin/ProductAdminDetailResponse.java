package binh.shopee.dto.admin;
import binh.shopee.dto.product.BrandInfo;
import binh.shopee.dto.product.ImageInfo;
import binh.shopee.dto.product.VariantInfo;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
/**
 * Admin DTO for complete product details
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAdminDetailResponse {
    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private String status;

    // Category info
    private Long categoryId;
    private String categoryName;

    // Brand info
    private Long brandId;
    private String brandName;
    private BrandInfo brand;

    // Images and variants
    private List<ImageInfo> images;
    private List<VariantInfo> variants;

    // Stats
    private Long totalPurchaseCount;
    private Integer totalStock;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}