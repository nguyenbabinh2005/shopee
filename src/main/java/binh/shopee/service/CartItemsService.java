package binh.shopee.service;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartQuantityResponse;
import binh.shopee.dto.discount.DiscountResult;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.entity.CartItems;
import binh.shopee.entity.Carts;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.CartItemsRepository;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
@Service
@RequiredArgsConstructor
public class CartItemsService {
    private final DiscountService discountService;
    private final CartItemsRepository cartItemsRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final CartsRepository cartsRepository;
    private final CartsService cartsService;
    private final InventoryService inventoryService;
    @Transactional
    public CartQuantityResponse updateQuantity(Long cartId, Long variantId, String action) {
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong giỏ"));

        System.out.println("Action received: '" + action + "'");

        String act = action == null ? "" : action.trim();

        if ("increase".equalsIgnoreCase(act)) {
            item.setQuantity(item.getQuantity() + 1);
            cartItemsRepository.save(item);
        } else if ("decrease".equalsIgnoreCase(act)) {
            int newQty = item.getQuantity() - 1;
            if (newQty <= 0) {
                cartItemsRepository.delete(item);
            } else {
                item.setQuantity(newQty);
                cartItemsRepository.save(item);
            }

        } else {
            throw new IllegalArgumentException("Action không hợp lệ: chỉ nhận 'increase' hoặc 'decrease'");
        }
        BigDecimal lineTotal = item.getLineTotal() != null ? item.getLineTotal() : BigDecimal.ZERO;
        BigDecimal totalAmount = cartItemsRepository.findCartItemsByCartId(cartId).stream()
                .map(ci -> ci.getLineTotal() != null ? ci.getLineTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return CartQuantityResponse.builder()
                .cartId(cartId)
                .variantId(variantId)
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .totalAmount(totalAmount)
                .build();
    }


    @Transactional
    public void addToCart(Long cartId, VariantItem request) {

        Carts cart = cartsRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));
        ProductVariants variant = productVariantsRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        int avalableQty = inventoryService.getAvailableQuantity((request.getVariantId()));
        if (avalableQty < request.getQuantity()) {
            throw new RuntimeException("Sản phẩm ko còn đủ");
        }
        CartItems existingItem = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, request.getVariantId())
                .orElse(null);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemsRepository.save(existingItem);
        }
        else {
            DiscountResult discountResult =
                    discountService.calculateVariantDiscount(
                            variant.getVariantId(),
                            request.getQuantity()
                    );
            existingItem = CartItems.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .priceSnapshot(variant.getPriceOverride())  // giá tại thời điểm thêm vào giỏ
                    .discountSnapshot(discountResult.getDiscountAmount())
                    .build();
        }
        cartItemsRepository.save(existingItem);
    }
    @Transactional
    public CartDetailResponse removeCartItem(Long cartId, Long variantId) {
        CartItems item = cartItemsRepository.findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong giỏ hàng"));
        // 2️⃣ Xóa sản phẩm
        cartItemsRepository.delete(item);
        return cartsService.getCartDetail(cartId);
    }
}