package binh.shopee.controller;

import binh.shopee.dto.order.CheckoutCalculateRequest;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.CheckoutTotalResponse;
import binh.shopee.dto.order.OrderCreateRequest;
import binh.shopee.dto.order.OrderResponse;
import binh.shopee.dto.order.SelectShippingRequest;
import binh.shopee.dto.order.SelectVoucherRequest;
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
        CheckoutResponse response = ordersService.getCheckoutInfo(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/create")
    public ResponseEntity<OrderResponse> createOrder(
            @RequestBody OrderCreateRequest request
    ) {
        OrderResponse response = ordersService.createOrder(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/checkout/select-shipping")
    public ResponseEntity<CheckoutResponse> selectShipping(
            @RequestBody SelectShippingRequest request
    ) {
        return ResponseEntity.ok(
                ordersService.selectShipping(request)
        );
    }
    @PostMapping("/checkout/select-voucher")
    public ResponseEntity<CheckoutResponse> selectVoucher(
            @RequestBody SelectVoucherRequest request
    ) {
        return ResponseEntity.ok(
                ordersService.selectVoucher(request)
        );
    }

}
