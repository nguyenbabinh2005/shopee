package binh.shopee.repository;

import binh.shopee.entity.FlashSaleUserPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlashSaleUserPurchaseRepository extends JpaRepository<FlashSaleUserPurchase, Long> {

    @Query("""
        SELECT fsup FROM FlashSaleUserPurchase fsup
        WHERE fsup.flashSale.flashSaleId = :flashSaleId
        AND fsup.user.userId = :userId
        """)
    Optional<FlashSaleUserPurchase> findByFlashSaleIdAndUserId(
            @Param("flashSaleId") Long flashSaleId,
            @Param("userId") Long userId
    );

    @Query("""
        SELECT COALESCE(SUM(fsup.purchasedQuantity), 0)
        FROM FlashSaleUserPurchase fsup
        WHERE fsup.flashSale.flashSaleId = :flashSaleId
        AND fsup.user.userId = :userId
        """)
    Integer getTotalPurchasedByUserAndFlashSale(
            @Param("flashSaleId") Long flashSaleId,
            @Param("userId") Long userId
    );
}