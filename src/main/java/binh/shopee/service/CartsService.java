package binh.shopee.service;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.entity.CartItems;
import binh.shopee.entity.Carts;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.CartItemsRepository;
import binh.shopee.repository.ProductImagesRepository;
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
    private final ProductImagesRepository productImagesRepository;

    @Transactional(readOnly = true)
    public CartDetailResponse getCartDetail(Long cartId) {
        CartDetailResponse cartDetail = cartsRepository.findCartSummaryById(cartId);
        if (cartDetail == null) {
            throw new RuntimeException("Không tìm thấy giỏ hàng với ID: " + cartId);
        }

        List<CartItemResponse> items = cartItemsRepository.findCartItemsByCartId(cartId);
        items.forEach(item -> {
            item.setFinalPrice(item.getPriceSnapshot().subtract(item.getDiscountSnapshot()));

            try {
                CartItems cartItem = cartItemsRepository.findById(item.getItemId()).orElse(null);
                if (cartItem != null &&
                        cartItem.getVariant() != null &&
                        cartItem.getVariant().getProducts() != null) {

                    Optional<ProductImages> primaryImage = productImagesRepository
                            .findFirstByProductsAndIsPrimaryTrue(cartItem.getVariant().getProducts());

                    if (primaryImage.isPresent()) {
                        item.setImageUrl(primaryImage.get().getImageUrl());
                    }
                }
            } catch (Exception e) {
                item.setImageUrl(null);
            }
        });

        cartDetail.setItems(items);
        return cartDetail;
    }

    @Transactional
    public CartDetailResponse addToCart(Long cartId, Long variantId, Integer quantity) {
        Carts cart = cartsRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        ProductVariants variant = productVariantsRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Optional<CartItems> existingItem = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId);

        if (existingItem.isPresent()) {
            CartItems item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemsRepository.save(item);
        } else {
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

        return getCartDetail(cartId);
    }

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
                cartItemsRepository.delete(item);
                return getCartDetail(cartId);
            }
        } else {
            throw new RuntimeException("Action không hợp lệ");
        }

        cartItemsRepository.save(item);
        return getCartDetail(cartId);
    }

    @Transactional
    public CartDetailResponse removeFromCart(Long cartId, Long variantId) {
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));

        cartItemsRepository.delete(item);
        return getCartDetail(cartId);
    }

    @Transactional
    public void removeOrderedItemsFromCart(Long userId, List<Long> orderedVariantIds) {
        Carts cart = cartsRepository.findByUser_UserIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        for (Long variantId : orderedVariantIds) {
            Optional<CartItems> item = cartItemsRepository
                    .findByCart_CartIdAndVariant_VariantId(cart.getCartId(), variantId);

            item.ifPresent(cartItemsRepository::delete);
        }
    }
}