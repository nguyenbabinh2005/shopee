package binh.shopee.repository;

import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.entity.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface CartItemsRepository extends JpaRepository<CartItems, Long> {
    // 🔹 Lấy danh sách item trong giỏ (join sang variant & product)
    @Query("""
        SELECT new binh.shopee.dto.cart.CartItemResponse(
            ci.itemId,
            v.variantId,
            p.productId,
            p.name,
            v.attributesJson,
            ci.quantity,
            ci.priceSnapshot,
            ci.discountSnapshot,
            ci.lineTotal,
            ci.createdAt,
            ci.updatedAt
        )
        FROM CartItems ci
        JOIN ci.variant v
        JOIN v.products p
        WHERE ci.cart.cartId = :cartId
    """)
    List<CartItemResponse> findCartItemsByCartId(@Param("cartId") Long cartId);

}
