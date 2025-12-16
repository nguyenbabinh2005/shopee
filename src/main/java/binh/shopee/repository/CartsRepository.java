package binh.shopee.repository;

import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.entity.Carts;
import binh.shopee.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartsRepository extends JpaRepository<Carts, Long> {
    // 🔹 Lấy thông tin giỏ hàng chi tiết (không bao gồm list items)
    @Query("""
        SELECT new binh.shopee.dto.cart.CartDetailResponse(
            c.cartId,
            c.user.userId,
            c.sessionId,
            c.isActive,
            c.currency,
            c.expiresAt,
            c.createdAt,
            c.updatedAt,
            null,
            SUM(ci.lineTotal)
        )
        FROM Carts c
        LEFT JOIN CartItems ci ON ci.cart = c
        WHERE c.cartId = :cartId
        GROUP BY c.cartId, c.user.userId, c.sessionId, c.isActive,
                 c.currency, c.expiresAt, c.createdAt, c.updatedAt
    """)
    CartDetailResponse findCartSummaryById(@Param("cartId") Long cartId);
    Optional<Carts> findByUser_UserIdAndIsActiveTrue(Long userId);
}
