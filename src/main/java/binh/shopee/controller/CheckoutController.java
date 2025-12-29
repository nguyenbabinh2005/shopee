package binh.shopee.controller;
import binh.shopee.dto.order.CheckoutRequest;
import binh.shopee.dto.order.CheckoutResponse;
import binh.shopee.dto.order.RemoveVoucherRequest;
import binh.shopee.dto.order.SelectAddressRequest;
import binh.shopee.dto.order.SelectPaymentMethodRequest;
import binh.shopee.dto.order.SelectShippingRequest;
import binh.shopee.dto.order.SelectVoucherRequest;
import binh.shopee.service.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @GetMapping("/init")
    public ResponseEntity<CheckoutResponse> initCheckout(
            @RequestBody CheckoutRequest request,
            @RequestParam Long userId) {

        CheckoutResponse response = checkoutService.getCheckoutInfo(
                request,
                userId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/select-address")
    public ResponseEntity<CheckoutResponse> selectAddress(
            @RequestBody SelectAddressRequest request,
            @RequestParam Long userId) {

        CheckoutResponse response = checkoutService.selectAddress(
                request,
                userId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/select-shipping")
    public ResponseEntity<CheckoutResponse> selectShipping(
            @RequestBody SelectShippingRequest request,
            @RequestParam Long userId) {

        CheckoutResponse response = checkoutService.selectShipping(
                request,
                userId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/apply-voucher")
    public ResponseEntity<CheckoutResponse> applyVoucher(
            @RequestBody SelectVoucherRequest request,
            @RequestParam Long userId) {

        CheckoutResponse response = checkoutService.selectVoucher(
                request,
                userId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/remove-voucher")
    public ResponseEntity<CheckoutResponse> removeVoucher(
            @RequestBody RemoveVoucherRequest request,
            @RequestParam Long userId) {

        SelectVoucherRequest selectRequest = new SelectVoucherRequest();
        selectRequest.setVariants(request.getVariants());
        selectRequest.setVouchercode(null);
        selectRequest.setShippingMethodId(request.getShippingMethodId());
        selectRequest.setPaymentMethodCode(request.getPaymentMethodCode());

        CheckoutResponse response = checkoutService.selectVoucher(
                selectRequest,
                userId
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/select-payment")
    public ResponseEntity<CheckoutResponse> selectPaymentMethod(
            @RequestBody SelectPaymentMethodRequest request,
            @RequestParam Long userId) {

        CheckoutResponse response = checkoutService.selectPaymentMethod(
                request,
                userId
        );

        return ResponseEntity.ok(response);
    }

}
