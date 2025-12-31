package binh.shopee.repository;
import binh.shopee.dto.product.ProductDetailResponse;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.entity.Products;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
public interface ProductsRepository extends JpaRepository<Products, Long> {
    Optional<Products> findById(Long productId);
    // ==================== ADMIN METHODS (NEW) ====================

    /**
     * Find products by name containing keyword (case insensitive) with pagination
     */
    Page<Products> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Find products by status with pagination
     */
    Page<Products> findByStatus(String status, Pageable pageable);

    // ==================== EXISTING METHODS ====================
    @Query("""
SELECT new binh.shopee.dto.product.ProductSearchResponse(
    p.productId,
    p.name,
    p.price,
    COALESCE(
        CASE
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.percentage
                THEN (p.price * d.discountValue / 100)
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.fixed
                THEN d.discountValue
            ELSE 0
        END,
        0
    ),
    (p.price - COALESCE(
        CASE
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.percentage
                THEN (p.price * d.discountValue / 100)
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.fixed
                THEN d.discountValue
            ELSE 0
        END,
        0
    )),
    MAX(CASE WHEN pi.isPrimary = true THEN pi.imageUrl END),
    p.totalPurchaseCount,
    COALESCE(ROUND(AVG(r.rating), 1), 0.0)
)
FROM Products p
LEFT JOIN ProductImages pi ON pi.products = p
LEFT JOIN Discounts d
       ON d.product = p
      AND d.isActive = true
      AND CURRENT_TIMESTAMP BETWEEN d.startTime AND d.endTime
LEFT JOIN Reviews r
       ON r.products = p
      AND r.status = 'approved'
WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
GROUP BY p.productId, p.name, p.price, p.totalPurchaseCount, d.discountType, d.discountValue
""")
    List<ProductSearchResponse> searchProducts(@Param("keyword") String keyword);
    @Query("""
        SELECT new binh.shopee.dto.product.ProductDetailResponse(
            p.productId,
            p.name,
            p.description,
            p.price,
            p.status,
            p.createdAt,
            p.updatedAt,
            new binh.shopee.dto.product.BrandInfo(
                b.brandId,
                b.name,
                b.slug,
                b.logoUrl,
                b.website,
                b.description
            ),
            null,    
            null,
            null,
            COALESCE((SELECT COUNT(r.reviewId)
                      FROM Reviews r
                      WHERE r.products = p AND r.status = 'approved'), 0)
        )
        FROM Products p
        LEFT JOIN p.brand b
        WHERE p.productId = :productId
    """)
    Optional<ProductDetailResponse> findProductDetailById(@Param("productId") Long productId);
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
FROM Products p
LEFT JOIN ProductImages pi
       ON pi.products = p
LEFT JOIN Discounts d
       ON d.product = p
      AND d.isActive = true
      AND CURRENT_TIMESTAMP BETWEEN d.startTime AND d.endTime
LEFT JOIN Reviews r
       ON r.products = p
      AND r.status = 'approved'
WHERE p.status = binh.shopee.entity.Products.ProductStatus.active
GROUP BY
    p.productId,
    p.name,
    p.price,
    p.totalPurchaseCount,
    d.discountType,
    d.discountValue
ORDER BY p.totalPurchaseCount DESC
""")
    List<ProductSearchResponse> findTopSellingProducts(Pageable pageable);
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
FROM Products p
LEFT JOIN ProductImages pi
       ON pi.products = p
LEFT JOIN Discounts d
       ON d.product = p
      AND d.isActive = true
      AND CURRENT_TIMESTAMP BETWEEN d.startTime AND d.endTime
LEFT JOIN Reviews r
       ON r.products = p
      AND r.status = 'approved'
WHERE p.status = binh.shopee.entity.Products.ProductStatus.active
GROUP BY
    p.productId,
    p.name,
    p.price,
    p.totalPurchaseCount,
    p.createdAt,
    d.discountType,
    d.discountValue
ORDER BY p.createdAt DESC
""")
    List<ProductSearchResponse> findTopProducts(Pageable pageable);
    @Query("""
SELECT new binh.shopee.dto.product.ProductSearchResponse(
    p.productId,
    p.name,
    p.price,
    COALESCE(
        CASE
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.percentage
                THEN (p.price * d.discountValue / 100)
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.fixed
                THEN d.discountValue
            ELSE 0
        END,
        0
    ),
    (p.price - COALESCE(
        CASE
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.percentage
                THEN (p.price * d.discountValue / 100)
            WHEN d.discountType = binh.shopee.entity.Discounts.DiscountType.fixed
                THEN d.discountValue
            ELSE 0
        END,
        0
    )),
    MAX(CASE WHEN pi.isPrimary = true THEN COALESCE(pi.imageUrl, '') END),
    p.totalPurchaseCount,
    COALESCE(CAST(AVG(r.rating) AS double), 0.0)
)
FROM Products p
LEFT JOIN ProductImages pi ON pi.products = p
LEFT JOIN Discounts d ON d.product = p
    AND d.isActive = true
    AND d.startTime <= CURRENT_TIMESTAMP
    AND d.endTime >= CURRENT_TIMESTAMP
LEFT JOIN Reviews r ON r.products = p AND r.status = 'approved'
WHERE (:minPrice IS NULL OR p.price >= :minPrice)
  AND (:maxPrice IS NULL OR p.price <= :maxPrice)
  AND (:onlyDiscount = false OR d.discountId IS NOT NULL)
GROUP BY 
    p.productId, 
    p.name, 
    p.price, 
    d.discountType, 
    d.discountValue, 
    p.totalPurchaseCount
HAVING (:minRating IS NULL OR COALESCE(AVG(r.rating), 0) >= :minRating)
""")
    List<ProductSearchResponse> filterProducts(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("onlyDiscount") boolean onlyDiscount,
            @Param("minRating") BigDecimal minRating
    );
}