package binh.shopee.controller;

import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.service.CartsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartsController {
    private final CartsService cartService;
    @GetMapping("/{cartId}")
    public ResponseEntity<?> getCartDetail(@PathVariable Long cartId) {
        try {
            CartDetailResponse cart = cartService.getCartDetail(cartId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Không tìm thấy giỏ hàng với ID: " + cartId);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Đã xảy ra lỗi khi lấy giỏ hàng");
        }
    }

}