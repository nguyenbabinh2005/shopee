package binh.shopee.repository;
import binh.shopee.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, Long> {

    // Get all reviews for a product
    List<Reviews> findByProducts_ProductIdAndStatus(Long productId, String status);

    // Get all reviews by a user - FIXED: Use createdAt instead of created_at
    @Query("SELECT r FROM Reviews r WHERE r.users.userId = :userId ORDER BY r.created_at DESC")
    List<Reviews> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    // Check if user already reviewed this product from this order
    @Query("SELECT r FROM Reviews r WHERE r.users.userId = :userId " +
            "AND r.products.productId = :productId " +
            "AND r.order.orderId = :orderId")
    Optional<Reviews> findByUserAndProductAndOrder(
            @Param("userId") Long userId,
            @Param("productId") Long productId,
            @Param("orderId") Long orderId
    );

    // Check if user has reviewed this product (from any order)
    boolean existsByUsers_UserIdAndProducts_ProductId(Long userId, Long productId);
}