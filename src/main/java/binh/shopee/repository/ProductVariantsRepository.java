package binh.shopee.repository;

import binh.shopee.entity.ProductVariants;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantsRepository extends JpaRepository<ProductVariants, Long> {
    List<ProductVariants> findByProducts_ProductId(Long productId);
}
