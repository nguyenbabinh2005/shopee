package binh.shopee.repository;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ProductVariantsRepository extends JpaRepository<ProductVariants, Long> {
    List<ProductVariants> findByProducts_ProductId(Long productId);
    Optional<ProductVariants> findById(Long variantId);
    // ==================== ADMIN METHODS ====================

    /**
     * Find all variants for a product
     */
    List<ProductVariants> findByProducts(Products products);
}