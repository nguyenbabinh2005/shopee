package binh.shopee.dto.product;

import binh.shopee.entity.Products;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {

    private Long productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Products.ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ===== THƯƠNG HIỆU =====
    private BrandInfo brand;

    // ===== DANH SÁCH ẢNH =====
    private List<ImageInfo> images;

    // ===== DANH SÁCH BIẾN THỂ =====
    private List<VariantInfo> variants;
    // ===== ĐÁNH GIÁ =====
    private List<ReviewInfo> reviews;

    // ====== ĐIỂM TRUNG BÌNH & SỐ LƯỢNG ĐÁNH GIÁ ======
    private Long totalReviews;
}