package binh.shopee.controller;

import binh.shopee.dto.cart.CartDetailResponse;
import binh.shopee.dto.cart.CartQuantityResponse;
import binh.shopee.service.CartItemsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cartitem")
@RequiredArgsConstructor
public class CartItemsController {
    @Autowired
    private final CartItemsService cartItemService;
    @PutMapping("/update-quantity")
    public ResponseEntity<CartQuantityResponse> updateQuantity(
            @RequestParam Long cartId,
            @RequestParam Long variantId,
            @RequestParam String action
    ) {
        CartQuantityResponse response = cartItemService.updateQuantity(cartId, variantId, action);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestParam Long cartId, @RequestParam Long variantId) {
        cartItemService.addToCart(cartId, variantId);
        return ResponseEntity.ok("✅ Thêm sản phẩm vào giỏ hàng thành công");
    }
    @DeleteMapping("/item")
    public ResponseEntity<CartDetailResponse> removeCartItem(
            @RequestParam Long cartId,
            @RequestParam Long variantId
    ) {
        CartDetailResponse updatedCart = cartItemService.removeCartItem(cartId, variantId);
        return ResponseEntity.ok(updatedCart);
    }
}
