package binh.shopee.controller;
import binh.shopee.dto.order.CancelOrderRequest;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderCreateResponse;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.service.OrdersService;
import binh.shopee.service.userdetail.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;
import binh.shopee.entity.Orders.OrderStatus;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {
    private final OrdersService ordersService;
    @GetMapping("/search")
    public OrderResponse findByOrderNumber(
            @RequestParam String orderNumber
    ) {
        return ordersService.getOrderByOrderNumber(orderNumber);
    }
    @GetMapping
    public List<OrderResponse> getOrdersByStatus(
            @RequestParam OrderStatus status
    ) {
        return ordersService.getOrdersByStatus(status);
    }
    // 🔥 NEW: Get all orders for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @PathVariable Long userId
    ) {
        List<OrderResponse> orders = ordersService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    @PostMapping("/create")
    public ResponseEntity<OrderCreateResponse> createOrder(
            @RequestBody OrderCreateRequest request
    ) {
        // nếu ordersService.createOrder cần userId, truyền vào
        OrderCreateResponse response = ordersService.createOrder(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<OrderCreateResponse> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long userId, // thay @AuthenticationPrincipal
            @RequestBody CancelOrderRequest request
    ) {
        OrderCreateResponse response = ordersService.cancelOrder(
                orderId,
                userId,
                request
        );
        return ResponseEntity.ok(response);
    }
}