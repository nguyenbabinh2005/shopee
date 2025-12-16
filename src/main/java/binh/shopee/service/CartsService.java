package binh.shopee.service;

import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemResponse;
import binh.shopee.repository.CartsRepository;
import binh.shopee.repository.CartItemsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartsService {
    private final CartsRepository cartsRepository;
    private final CartItemsRepository cartItemsRepository;

    /**
     * Lấy chi tiết giỏ hàng (cart + items + tổng tiền)
     */
    @Transactional(readOnly = true)
    public CartDetailResponse getCartDetail(Long cartId) {
        // 1️⃣ Lấy thông tin tổng quát giỏ hàng (cart + totalAmount)
        CartDetailResponse cartDetail = cartsRepository.findCartSummaryById(cartId);
        if (cartDetail == null) {
            throw new RuntimeException("Không tìm thấy giỏ hàng với ID: " + cartId);
        }
        // 2️⃣ Lấy danh sách các sản phẩm trong giỏ
        List<CartItemResponse> items = cartItemsRepository.findCartItemsByCartId(cartId);

        items.forEach(item -> {
            item.setFinalPrice(item.getPriceSnapshot().subtract(item.getDiscountSnapshot()));
        });
        cartDetail.setItems(items);
        return cartDetail;
    }

}
