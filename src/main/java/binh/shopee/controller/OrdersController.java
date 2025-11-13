package binh.shopee.controller;

import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class OrdersController {
    @Autowired
    private final OrdersService ordersService;

    @PostMapping
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
        return ResponseEntity.ok(response);
    }
}
