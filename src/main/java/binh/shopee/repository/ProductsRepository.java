package binh.shopee.repository;

import binh.shopee.dto.product.ProductDetailResponse;
import binh.shopee.dto.product.ProductSearchResponse;
import binh.shopee.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductsRepository extends JpaRepository<Products, Long> {
    Optional<Products> findById(Long productId);
    @Query("""
SELECT new binh.shopee.dto.product.ProductSearchResponse(
    p.productId,
    p.name,
    p.slug,
    p.price,
    MAX(CASE WHEN pi.isPrimary = true THEN pi.imageUrl END)
)
FROM Products p
LEFT JOIN ProductImages pi ON pi.products = p
WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
GROUP BY p.productId, p.name, p.slug, p.price
""")
    List<ProductSearchResponse> searchProducts(@Param("keyword") String keyword);
    Optional<Products> findBySlug(String slug);
    @Query("""
SELECT new binh.shopee.dto.product.ProductSearchResponse(
    p.productId,
    p.name,
    p.slug,
    p.price,
    MAX(CASE WHEN pi.isPrimary = true THEN pi.imageUrl END)
)
FROM Products p
LEFT JOIN ProductImages pi ON pi.products = p
WHERE p.brand.brandId = :brandId
GROUP BY p.productId, p.name, p.slug, p.price
""")
    List<ProductSearchResponse> findProductsByBrand(@Param("brandId") Long brandId);
    @Query("""
        SELECT new binh.shopee.dto.product.ProductDetailResponse(
            p.productId,
            p.name,
            p.slug,
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
            (SELECT CAST(COUNT(pi.imageId) AS long)
             FROM ProductImages pi
             WHERE pi.products = p),

   
            (SELECT CAST(COUNT(v.variantId) AS long)
             FROM ProductVariants v
             WHERE v.products = p),

            COALESCE((SELECT AVG(r.rating)
                      FROM Reviews r
                      WHERE r.products = p AND r.status = 'approved'), 0.0),

            COALESCE((SELECT COUNT(r.reviewId)
                      FROM Reviews r
                      WHERE r.products = p AND r.status = 'approved'), 0)
        )
        FROM Products p
        LEFT JOIN p.brand b
        WHERE p.productId = :productId
    """)
    Optional<ProductDetailResponse> findProductDetailById(@Param("productId") Long productId);

}
