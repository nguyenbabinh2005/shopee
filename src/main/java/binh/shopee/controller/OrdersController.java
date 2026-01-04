package binh.shopee.controller;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderCreateResponse;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
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
        OrderCreateResponse response = ordersService.createOrder(request);
        return ResponseEntity.ok(response);
    }

    // ✅ UPDATED: Simplified cancel endpoint - no request body needed
    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId
    ) {
        try {
            OrderCreateResponse response = ordersService.cancelOrder(orderId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", response.getMessage(),
                    "orderId", response.getOrderId(),
                    "status", response.getStatus()
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", ex.getMessage()
                    ));
        }
    }
}
