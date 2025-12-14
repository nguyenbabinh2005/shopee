package binh.shopee.repository;

import binh.shopee.entity.Discounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface DiscountsRepository extends JpaRepository<Discounts, Long> {
    @Query("""
    SELECT d
    FROM Discounts d
    WHERE d.product.productId = :productId
      AND d.isActive = true
      AND :now BETWEEN d.startTime AND d.endTime
""")
    Optional<Discounts> findActiveDiscountByProductId(
            @Param("productId") Long productId,
            @Param("now") LocalDateTime now
    );
}
