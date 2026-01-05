package binh.shopee.repository;

import binh.shopee.entity.FlashSales;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlashSalesRepository extends JpaRepository<FlashSales, Long> {
    @Query("""
    SELECT fs
    FROM FlashSales fs
    JOIN FETCH fs.product p
    WHERE fs.status = :status
      AND fs.startTime <= :now
      AND fs.endTime > :now
""")
    List<FlashSales> findActiveFlashSales(
            @Param("status") FlashSales.FlashSaleStatus status,
            @Param("now") LocalDateTime now
    );
    @Query("""
    SELECT fs
    FROM FlashSales fs
    JOIN FETCH fs.product p
    WHERE fs.status = :status
      AND fs.startTime > :now
""")
    List<FlashSales> findUpcomingFlashSales(
            @Param("status") FlashSales.FlashSaleStatus status,
            @Param("now") LocalDateTime now
    );
    @Query("""
        SELECT fs FROM FlashSales fs
        WHERE fs.product.productId = :productId
        AND fs.status = binh.shopee.entity.FlashSales.FlashSaleStatus.active
        AND CURRENT_TIMESTAMP BETWEEN fs.startTime AND fs.endTime
        AND fs.sold < fs.quantity
        """)
    Optional<FlashSales> findActiveFlashSaleByProductId(@Param("productId") Long productId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT fs
        FROM FlashSales fs
        WHERE fs.flashSaleId = :flashSaleId
    """)
    Optional<FlashSales> findByIdForUpdate(@Param("flashSaleId") Long flashSaleId);
}
