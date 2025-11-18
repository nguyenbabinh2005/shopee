package binh.shopee.controller;

import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {
    private final OrdersService ordersService;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> getCheckoutInfo(
            @RequestBody CheckoutRequest request,
            @RequestParam Long userId
    ) {
        CheckoutResponse response = ordersService.getCheckoutInfo(request, userId);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderCreateRequest request
    ) {
        OrderResponse response = ordersService.createOrder(request);
        return ResponseEntity.ok(response);
    }
}
