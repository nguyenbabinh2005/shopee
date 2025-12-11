package binh.shopee.repository;

import binh.shopee.entity.FlashSales;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface FlashSalesRepository {
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
}
