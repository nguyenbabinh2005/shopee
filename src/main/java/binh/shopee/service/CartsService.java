package binh.shopee.service;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.entity.*;
import binh.shopee.repository.*;
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
    private final FlashSalesRepository flashSalesRepository;
    private final FlashSaleUserPurchaseRepository flashSaleUserPurchaseRepository;
    private final InventoryRepository inventoryRepository;
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
        Long productId = variant.getProducts().getProductId();
        Long userId = cart.getUser().getUserId();
        // 🔹 KIỂM TRA TỒN KHO
        Optional<Inventory> inventoryOpt = inventoryRepository.findByVariantVariantId(variantId);
        if (inventoryOpt.isPresent()) {
            Inventory inventory = inventoryOpt.get();
            Integer availableStock = inventory.getStockQty() - inventory.getReservedQty();

            Optional<CartItems> existingCartItem = cartItemsRepository
                    .findByCart_CartIdAndVariant_VariantId(cartId, variantId);
            Integer currentCartQuantity = existingCartItem.map(CartItems::getQuantity).orElse(0);
            Integer totalQuantityAfterAdd = currentCartQuantity + quantity;
            if (totalQuantityAfterAdd > availableStock) {
                throw new RuntimeException(
                        String.format("Sản phẩm chỉ còn %d trong kho. Bạn đã có %d trong giỏ hàng.",
                                availableStock, currentCartQuantity)
                );
            }
        }
        // 🔹 KIỂM TRA FLASH SALE - Validate giới hạn mua
        Optional<FlashSales> activeFlashSale = flashSalesRepository.findActiveFlashSaleByProductId(productId);

        if (activeFlashSale.isPresent()) {
            FlashSales flashSale = activeFlashSale.get();
            Integer maxPurchase = flashSale.getMaxPurchaseQuantity() != null
                    ? flashSale.getMaxPurchaseQuantity()
                    : 2;

            // Số lượng đã mua (từ orders đã hoàn thành)
            Integer purchasedQuantity = flashSaleUserPurchaseRepository
                    .getTotalPurchasedByUserAndFlashSale(flashSale.getFlashSaleId(), userId);

            // Số lượng hiện tại trong giỏ
            Optional<CartItems> existingCartItem = cartItemsRepository
                    .findByCart_CartIdAndVariant_VariantId(cartId, variantId);
            Integer currentCartQuantity = existingCartItem.map(CartItems::getQuantity).orElse(0);

            // Tổng số lượng sau khi thêm
            Integer totalQuantity = purchasedQuantity + currentCartQuantity + quantity;

            if (totalQuantity > maxPurchase) {
                int remaining = maxPurchase - purchasedQuantity - currentCartQuantity;
                if (remaining <= 0) {
                    throw new RuntimeException(
                            String.format("Bạn đã đạt giới hạn mua sản phẩm flash sale này (tối đa %d sản phẩm)", maxPurchase)
                    );
                } else {
                    throw new RuntimeException(
                            String.format("Bạn chỉ có thể mua thêm %d sản phẩm flash sale này (tối đa %d sản phẩm)",
                                    remaining, maxPurchase)
                    );
                }
            }
        }
        // Thêm vào giỏ hàng
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
            // 🔹 KIỂM TRA TỒN KHO
            Optional<Inventory> inventoryOpt = inventoryRepository.findByVariantVariantId(variantId);
            if (inventoryOpt.isPresent()) {
                Inventory inventory = inventoryOpt.get();
                Integer availableStock = inventory.getStockQty() - inventory.getReservedQty();

                if (item.getQuantity() + 1 > availableStock) {
                    throw new RuntimeException(
                            String.format("Sản phẩm chỉ còn %d trong kho", availableStock)
                    );
                }
            }
            // 🔹 KIỂM TRA FLASH SALE KHI TĂNG SỐ LƯỢNG
            Long productId = item.getVariant().getProducts().getProductId();
            Long userId = item.getCart().getUser().getUserId();

            Optional<FlashSales> activeFlashSale = flashSalesRepository.findActiveFlashSaleByProductId(productId);

            if (activeFlashSale.isPresent()) {
                FlashSales flashSale = activeFlashSale.get();
                Integer maxPurchase = flashSale.getMaxPurchaseQuantity() != null
                        ? flashSale.getMaxPurchaseQuantity()
                        : 2;

                Integer purchasedQuantity = flashSaleUserPurchaseRepository
                        .getTotalPurchasedByUserAndFlashSale(flashSale.getFlashSaleId(), userId);

                Integer currentCartQuantity = item.getQuantity();

                if (purchasedQuantity + currentCartQuantity + 1 > maxPurchase) {
                    throw new RuntimeException(
                            String.format("Bạn đã đạt giới hạn mua sản phẩm flash sale này (tối đa %d sản phẩm)", maxPurchase)
                    );
                }
            }

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