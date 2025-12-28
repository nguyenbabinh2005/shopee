package binh.shopee.service;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.entity.CartItems;
import binh.shopee.entity.Carts;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.CartItemsRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class CartsService {
    private final CartsRepository cartsRepository;
    private final CartItemsRepository cartItemsRepository;
    private final ProductVariantsRepository productVariantsRepository;
    /**
     * Lấy chi tiết giỏ hàng (cart + items + tổng tiền)
     */
    @Transactional(readOnly = true)
    public CartDetailResponse getCartDetail(Long cartId) {
        CartDetailResponse cartDetail = cartsRepository.findCartSummaryById(cartId);
        if (cartDetail == null) {
            throw new RuntimeException("Không tìm thấy giỏ hàng với ID: " + cartId);
        }

        List<CartItemResponse> items = cartItemsRepository.findCartItemsByCartId(cartId);
        items.forEach(item -> {
            item.setFinalPrice(item.getPriceSnapshot().subtract(item.getDiscountSnapshot()));
        });

        cartDetail.setItems(items);
        return cartDetail;
    }
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @Transactional
    public CartDetailResponse addToCart(Long cartId, Long variantId, Integer quantity) {
        // Validate cart
        Carts cart = cartsRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));
        // Validate variant
        ProductVariants variant = productVariantsRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        // Check if item already exists in cart
        Optional<CartItems> existingItem = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId);
        if (existingItem.isPresent()) {
            // Update quantity if exists
            CartItems item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemsRepository.save(item);
        } else {
            // Create new cart item
            BigDecimal price = variant.getPriceOverride() != null
                    ? variant.getPriceOverride()
                    : variant.getProducts().getPrice();
            CartItems newItem = CartItems.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(quantity)
                    .priceSnapshot(price)
                    .discountSnapshot(BigDecimal.ZERO)
                    .build();

            cartItemsRepository.save(newItem);
        }
        // Return updated cart
        return getCartDetail(cartId);
    }
    /**
     * Cập nhật số lượng sản phẩm
     */
    @Transactional
    public CartDetailResponse updateQuantity(Long cartId, Long variantId, String action) {
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));
        if ("increase".equals(action)) {
            item.setQuantity(item.getQuantity() + 1);
        } else if ("decrease".equals(action)) {
            if (item.getQuantity() > 1) {
                item.setQuantity(item.getQuantity() - 1);
            } else {
                // Remove if quantity becomes 0
                cartItemsRepository.delete(item);
                return getCartDetail(cartId);
            }
        } else {
            throw new RuntimeException("Action không hợp lệ");
        }
        cartItemsRepository.save(item);
        return getCartDetail(cartId);
    }
    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    @Transactional
    public CartDetailResponse removeFromCart(Long cartId, Long variantId) {
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));
        cartItemsRepository.delete(item);
        return getCartDetail(cartId);
    }
}