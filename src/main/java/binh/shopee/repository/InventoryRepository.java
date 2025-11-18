package binh.shopee.repository;
import binh.shopee.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByVariantVariantId(Long variantId);
    @Query("""
        SELECT (i.stockQty - i.reservedQty) 
        FROM Inventory i 
        WHERE i.variant.variantId = :variantId
    """)
    Integer getAvailableQuantity(Long variantId);
    @Modifying
    @Transactional
    @Query("""
        UPDATE Inventory i
        SET i.reservedQty = i.reservedQty + :quantity
        WHERE i.variant.variantId = :variantId
          AND (i.stockQty - i.reservedQty) >= :quantity
    """)
    int reserveStock(Long variantId, Integer quantity);
}
