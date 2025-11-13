package binh.shopee.service;

import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.dto.cart.CartQuantityResponse;
import binh.shopee.dto.order.VariantItem;
import binh.shopee.entity.CartItems;
import binh.shopee.entity.Carts;
import binh.shopee.entity.ProductVariants;
import binh.shopee.repository.CartItemsRepository;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.ProductVariantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartItemsService {
    @Autowired
    private final CartItemsRepository cartItemsRepository;
    @Autowired
    private final ProductVariantsRepository productVariantsRepository;
    @Autowired
    private final CartsRepository cartsRepository;
    @Autowired
    private final CartsService cartsService;
    @Autowired
    private final ProductVariantsService productVariantsService;
    @Transactional
    public CartQuantityResponse updateQuantity(Long cartId, Long variantId, String action) {
        // 1️⃣ Lấy CartItem
        CartItems item = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cartId, variantId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong giỏ"));

        // 2️⃣ Update quantity
        if (action.equalsIgnoreCase("increase")) {
            item.setQuantity(item.getQuantity() + 1);
        } else if (action.equalsIgnoreCase("decrease")) {
            int newQty = item.getQuantity() - 1;
            if (newQty <= 0) {
                cartItemsRepository.delete(item);
                item.setQuantity(0); // quantity = 0 khi xóa
            } else {
                item.setQuantity(newQty);
                cartItemsRepository.save(item);
            }
        } else {
            throw new RuntimeException("Action không hợp lệ");
        }

        // 3️⃣ Tính tổng tiền giỏ hàng hiện tại
        Carts cart = item.getCart();
        BigDecimal totalAmount = cart.getItems().stream()
                .map(ci -> ci.getPriceSnapshot().multiply(BigDecimal.valueOf(ci.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // 4️⃣ Trả quantity + total
        return CartQuantityResponse.builder()
                .variantId(variantId)
                .quantity(item.getQuantity())
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public void addToCart(Long cartId, VariantItem request) {

        // 1️⃣ Lấy giỏ hàng
        Carts cart = cartsRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        // 2️⃣ Lấy biến thể sản phẩm
        ProductVariants variant = productVariantsRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        // 3️⃣ Kiểm tra tồn kho
        int avalableQty = productVariantsService.getAvailableQuantity((request.getVariantId()));
        if (avalableQty < request.getQuantity()) {
            throw new RuntimeException("Sản phẩm không đủ hàng trong kho");
        }

        // 4️⃣ Tìm xem sản phẩm đã có trong giỏ chưa
        CartItems existingItem = cartItemsRepository
                .findByCart_CartIdAndVariant_VariantId(cart.getCartId(), variant.getVariantId())
                .orElse(null);

        // 5️⃣ Nếu có rồi → cộng thêm số lượng
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        }
        // 6️⃣ Nếu chưa có → tạo mới
        else {
            existingItem = CartItems.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .priceSnapshot(variant.getPriceOverride())   // giá tại thời điểm thêm vào giỏ
                    .discountSnapshot(BigDecimal.ZERO)
                    .build();
        }

        // 7️⃣ Lưu lại
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