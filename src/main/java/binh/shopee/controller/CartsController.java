package binh.shopee.controller;
import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartItemUpdateRequest;
import binh.shopee.service.CartsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CartsController {
    @Autowired
    private final CartsService cartService;
    /**
     * 🔹 API: Lấy chi tiết giỏ hàng theo ID
     */
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
    /**
     * 🔹 API: Thêm sản phẩm vào giỏ hàng
     */
    @PostMapping("/{cartId}/add")
    public ResponseEntity<?> addToCart(
            @PathVariable Long cartId,
            @RequestBody CartItemUpdateRequest request) {
        try {
            CartDetailResponse cart = cartService.addToCart(cartId, request.getVariantId(), request.getQuantity());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Đã xảy ra lỗi khi thêm vào giỏ hàng");
        }
    }
    /**
     * 🔹 API: Cập nhật số lượng sản phẩm trong giỏ
     */
    @PutMapping("/{cartId}/update-quantity")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long cartId,
            @RequestParam Long variantId,
            @RequestParam String action) {
        try {
            CartDetailResponse cart = cartService.updateQuantity(cartId, variantId, action);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Đã xảy ra lỗi khi cập nhật số lượng");
        }
    }
    /**
     * 🔹 API: Xóa sản phẩm khỏi giỏ hàng
     */
    @DeleteMapping("/{cartId}/remove/{variantId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartId,
            @PathVariable Long variantId) {
        try {
            CartDetailResponse cart = cartService.removeFromCart(cartId, variantId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Đã xảy ra lỗi khi xóa sản phẩm");
        }
    }
}