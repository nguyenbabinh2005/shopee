package binh.shopee.service;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartQuantityResponse;
import binh.shopee.dto.discount.DiscountResult;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.entity.CartItems;
import binh.shopee.entity.Carts;
import binh.shopee.entity.FlashSales;
import binh.shopee.entity.ProductVariants;
import binh.shopee.entity.Products;
import binh.shopee.repository.CartItemsRepository;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.FlashSalesRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;
import binh.shopee.entity.Discounts.DiscountType;
@Service
@RequiredArgsConstructor
public class CartItemsService {
    private final DiscountService discountService;
    private final CartItemsRepository cartItemsRepository;
    private final ProductVariantsRepository productVariantsRepository;
    private final CartsRepository cartsRepository;
    private final CartsService cartsService;
    private final InventoryService inventoryService;
    private final FlashSaleUserPurchaseService flashSaleUserPurchaseService;
    private final FlashSalesRepository flashSalesRepository;
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

        Products product = variant.getProducts();

        // Kiểm tra tồn kho
        int availableQty = inventoryService.getAvailableQuantity(request.getVariantId());
        if (availableQty < request.getQuantity()) {
            throw new RuntimeException("Sản phẩm không còn đủ");
        }

        // Kiểm tra item đã có trong giỏ chưa
        CartItems existingItem = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, request.getVariantId())
                .orElse(null);

        // Tính giá và discount (ưu tiên Flash Sale)
        BigDecimal priceSnapshot;
        BigDecimal discountSnapshot = BigDecimal.ZERO;

        // Xác định giá gốc
        priceSnapshot = variant.getPriceOverride() != null
                ? variant.getPriceOverride()
                : product.getPrice();

        // ✅ Kiểm tra Flash Sale trước
        Optional<FlashSales> activeFlashSale = flashSalesRepository
                .findActiveFlashSaleByProductId(product.getProductId());

        if (activeFlashSale.isPresent()) {
            FlashSales flashSale = activeFlashSale.get();
            System.out.println("⚡ Flash Sale detected when adding to cart! ID: " + flashSale.getFlashSaleId());

            // Kiểm tra Flash Sale còn hàng không
            int flashSaleRemaining = flashSale.getQuantity() - flashSale.getSold();
            if (flashSaleRemaining <= 0) {
                throw new RuntimeException("Flash Sale đã hết hàng");
            }

            // Kiểm tra giới hạn mua của user
            int userAvailableQty = flashSaleUserPurchaseService.getAvailableQuantityForUser(
                    flashSale.getFlashSaleId(),
                    cart.getUser().getUserId()
            );

            // Tính số lượng đã có trong giỏ
            int currentQtyInCart = existingItem != null ? existingItem.getQuantity() : 0;
            int totalRequestQty = currentQtyInCart + request.getQuantity();

            if (totalRequestQty > userAvailableQty) {
                throw new RuntimeException(
                        "Bạn chỉ được mua tối đa 2 sản phẩm Flash Sale này. " +
                                "Hiện tại bạn đã có " + currentQtyInCart + " trong giỏ hàng."
                );
            }

            // Tính discount từ Flash Sale
            if (flashSale.getDiscountType() == DiscountType.percentage) {
                discountSnapshot = priceSnapshot.multiply(flashSale.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            } else if (flashSale.getDiscountType() == DiscountType.fixed) {
                discountSnapshot = flashSale.getDiscountValue();
            }

            System.out.println("⚡ Flash Sale discount applied to cart: " + discountSnapshot);

        } else {
            // Không có Flash Sale, dùng discount thường
            System.out.println("➡️ No Flash Sale, using regular discount");
            DiscountResult discountResult = discountService.calculateVariantDiscount(
                    variant.getVariantId()
            );
            discountSnapshot = discountResult.getDiscountAmount();
        }

        // Cập nhật hoặc tạo mới cart item
        if (existingItem != null) {
            // Cập nhật số lượng
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());

            // ⚠️ Cập nhật lại giá và discount (quan trọng vì Flash Sale có thể thay đổi)
            existingItem.setPriceSnapshot(priceSnapshot);
            existingItem.setDiscountSnapshot(discountSnapshot);

            cartItemsRepository.save(existingItem);
            System.out.println("✅ Updated existing cart item");
        } else {
            // Tạo mới
            existingItem = CartItems.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .priceSnapshot(priceSnapshot)
                    .discountSnapshot(discountSnapshot)
                    .build();

            cartItemsRepository.save(existingItem);
            System.out.println("✅ Created new cart item");
        }

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