package binh.shopee.service;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.dto.discount.DiscountResult;
import binh.shopee.entity.CartItems;
import binh.shopee.entity.Carts;
import binh.shopee.entity.FlashSales;
import binh.shopee.entity.ProductImages;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.CartItemsRepository;
import binh.shopee.repository.FlashSalesRepository;
import binh.shopee.repository.ProductImagesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import binh.shopee.entity.Discounts.DiscountType;
@Service
@RequiredArgsConstructor
public class CartsService {
    private final CartsRepository cartsRepository;
    private final CartItemsRepository cartItemsRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final ProductImagesRepository productImagesRepository;
    private final InventoryService inventoryService;
    private final FlashSaleUserPurchaseService flashSaleUserPurchaseService;
    private final DiscountService discountService;
    private final FlashSalesRepository flashSalesRepository;
    @Transactional(readOnly = true)
    public CartDetailResponse getCartDetail(Long cartId) {
        CartDetailResponse cartDetail = cartsRepository.findCartSummaryById(cartId);
        if (cartDetail == null) {
            throw new RuntimeException("Không tìm thay cart: " + cartId);
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
        System.out.println("🛒 Adding to cart - CartId: " + cartId + ", VariantId: " + variantId + ", Quantity: " + quantity);

        Carts cart = cartsRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng"));

        ProductVariants variant = productVariantsRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        Products product = variant.getProducts();

        // 1️⃣ Kiểm tra tồn kho
        int availableQty = inventoryService.getAvailableQuantity(variantId);
        if (availableQty < quantity) {
            throw new RuntimeException("Sản phẩm không còn đủ. Chỉ còn " + availableQty + " sản phẩm");
        }

        // 2️⃣ Kiểm tra item đã có trong giỏ chưa
        Optional<CartItems> existingItem = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId);

        // 3️⃣ Xác định giá gốc
        BigDecimal priceSnapshot = variant.getPriceOverride() != null
                ? variant.getPriceOverride()
                : product.getPrice();

        BigDecimal discountSnapshot = BigDecimal.ZERO;

        // 4️⃣ Kiểm tra Flash Sale (ưu tiên cao nhất)
        Optional<FlashSales> activeFlashSale = flashSalesRepository
                .findActiveFlashSaleByProductId(product.getProductId());

        if (activeFlashSale.isPresent()) {
            FlashSales flashSale = activeFlashSale.get();
            System.out.println("  ⚡ Flash Sale detected! ID: " + flashSale.getFlashSaleId());

            // Kiểm tra Flash Sale còn hàng
            int flashSaleRemaining = flashSale.getQuantity() - flashSale.getSold();
            if (flashSaleRemaining <= 0) {
                throw new RuntimeException("Flash Sale đã hết hàng");
            }

            // Kiểm tra giới hạn mua của user (tối đa 2 sản phẩm)
            int userAvailableQty = flashSaleUserPurchaseService.getAvailableQuantityForUser(
                    flashSale.getFlashSaleId(),
                    cart.getUser().getUserId()
            );

            int currentQtyInCart = existingItem.isPresent() ? existingItem.get().getQuantity() : 0;
            int totalRequestQty = currentQtyInCart + quantity;

            if (totalRequestQty > userAvailableQty) {
                throw new RuntimeException(
                        "Bạn chỉ được mua tối đa 2 sản phẩm Flash Sale này. " +
                                "Hiện tại bạn đã có " + currentQtyInCart + " trong giỏ hàng."
                );
            }

            if (totalRequestQty > flashSaleRemaining) {
                throw new RuntimeException("Flash Sale chỉ còn " + flashSaleRemaining + " sản phẩm");
            }

            // Tính discount từ Flash Sale
            if (flashSale.getDiscountType() == DiscountType.percentage) {
                discountSnapshot = priceSnapshot.multiply(flashSale.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else if (flashSale.getDiscountType() == DiscountType.fixed) {
                discountSnapshot = flashSale.getDiscountValue();
            }

            System.out.println("  ⚡ Flash Sale discount: " + discountSnapshot);

        } else {
            // Không có Flash Sale, dùng discount thường
            System.out.println("  ko co flashahle");
            DiscountResult discountResult = discountService.calculateVariantDiscount(variantId);
            discountSnapshot = discountResult.getDiscountAmount();
            System.out.println("  giam: " + discountSnapshot);
        }

        // 5️⃣ Cập nhật hoặc tạo mới cart item
        if (existingItem.isPresent()) {
            CartItems item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            // ⚠️ Cập nhật lại giá và discount (vì Flash Sale có thể thay đổi)
            item.setPriceSnapshot(priceSnapshot);
            item.setDiscountSnapshot(discountSnapshot);
            cartItemsRepository.save(item);
            System.out.println("  cap nhat san pham gio hang");
        } else {
            CartItems newItem = CartItems.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(quantity)
                    .priceSnapshot(priceSnapshot)
                    .discountSnapshot(discountSnapshot)
                    .build();
            cartItemsRepository.save(newItem);
            System.out.println("them san pham moi vao gio hang");
        }

        return getCartDetail(cartId);
    }

    @Transactional
    public CartDetailResponse updateQuantity(Long cartId, Long variantId, String action) {
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("khong tim thay san pham trong gio"));

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
            throw new RuntimeException("khong kha dung hanh dong");
        }

        cartItemsRepository.save(item);
        return getCartDetail(cartId);
    }

    @Transactional
    public CartDetailResponse removeFromCart(Long cartId, Long variantId) {
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("khong tim thay san pham trong gio"));

        cartItemsRepository.delete(item);
        return getCartDetail(cartId);
    }

    @Transactional
    public void removeOrderedItemsFromCart(Long userId, List<Long> orderedVariantIds) {
        Carts cart = cartsRepository.findByUser_UserIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new RuntimeException("ko tim thay gio hang nguoi dung"));

        for (Long variantId : orderedVariantIds) {
            Optional<CartItems> item = cartItemsRepository
                    .findByCart_CartIdAndVariant_VariantId(cart.getCartId(), variantId);

            item.ifPresent(cartItemsRepository::delete);
        }
    }
}