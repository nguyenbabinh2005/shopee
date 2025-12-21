package binh.shopee.controller;
import binh.shopee.dto.order.CancelOrderRequest;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.service.OrdersService;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {
    private final OrdersService ordersService;
    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderCreateRequest request
    ) {
        OrderResponse response = ordersService.createOrder(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CancelOrderRequest request
    ) {
        OrderResponse response = ordersService.cancelOrder(
                orderId,
                user.getUser().getUserId(),
                request
        );
        return ResponseEntity.ok(response);
    }
}
