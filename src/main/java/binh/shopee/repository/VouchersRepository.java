package binh.shopee.repository;

import binh.shopee.entity.Vouchers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VouchersRepository extends JpaRepository<Vouchers, Long> {
    Optional<Vouchers> findByCodeAndStatus(String code, Vouchers.VoucherStatus status);
    @Query("""
        SELECT v
        FROM Vouchers v
        WHERE v.status = :status
          AND v.startTime <= :now
          AND v.endTime >= :now
          AND (v.usageLimit IS NULL OR v.usedCount < v.usageLimit)
    """)
    List<Vouchers> findAvailableVouchers(
            @Param("status") Vouchers.VoucherStatus status,
            @Param("now") LocalDateTime now
    );

}

