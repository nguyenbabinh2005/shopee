package binh.shopee.dto.product;

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

    // ===== SẢN PHẨM CHÍNH =====
    private Long productId;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private String status;
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
    private Double averageRating;
    private Long totalReviews;
}