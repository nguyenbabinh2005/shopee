package binh.shopee.repository;

import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.entity.ProductCategories;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
public interface ProductCategoriesRepository extends JpaRepository<ProductCategories, Long> {
    @Query("""
SELECT new binh.shopee.dto.product.ProductSearchResponse(
    p.productId,
    p.name,
    p.price,

    COALESCE(
        CASE
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.percentage
                THEN p.price * d.discountValue / 100
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.fixed
                THEN d.discountValue
        END,
        0
    ),

    p.price - COALESCE(
        CASE
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.percentage
                THEN p.price * d.discountValue / 100
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.fixed
                THEN d.discountValue
        END,
        0
    ),

    MAX(CASE WHEN pi.isPrimary = true THEN pi.imageUrl END),

    p.totalPurchaseCount,

    COALESCE(ROUND(AVG(r.rating), 1), 0.0)
)
FROM ProductCategories pc
JOIN pc.product p
LEFT JOIN ProductImages pi
       ON pi.products = p
LEFT JOIN Discounts d
       ON d.product = p
      AND d.isActive = true
      AND CURRENT_TIMESTAMP BETWEEN d.startTime AND d.endTime
LEFT JOIN Reviews r
       ON r.products = p
      AND r.status = 'approved'
WHERE
    pc.category.categoryId = :categoryId
    AND p.status = binh.shopee.entity.Products.ProductStatus.active
GROUP BY
    p.productId,
    p.name,
    p.price,
    p.totalPurchaseCount,
    d.discountType,
    d.discountValue
""")
    Page<ProductSearchResponse> findProductSearchByCategory(
            Long categoryId,
            Pageable pageable
    );

}
