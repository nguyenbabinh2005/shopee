package binh.shopee.service;

import binh.shopee.dto.order.PaymentMethodResponse;
import binh.shopee.entity.PaymentMethods;
import binh.shopee.repository.PaymentMethodsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodsService {
    private final PaymentMethodsRepository paymentMethodRepository;

    public List<PaymentMethodResponse> getAvailableMethods() {
        return paymentMethodRepository.findByStatus("active");
    }
    public PaymentMethodResponse getByCode(String code) {

        PaymentMethods method = paymentMethodRepository
                .findByCodeAndStatus(code, "active")
                .orElseThrow(() ->
                        new RuntimeException("Payment method không hợp lệ: " + code)
                );

        return mapToResponse(method);
    }

    private PaymentMethodResponse mapToResponse(PaymentMethods method) {
        return PaymentMethodResponse.builder()
                .paymentMethodId(method.getPaymentMethodId())
                .code(method.getCode())
                .displayName(method.getDisplayName())
                .build();
    }
    public PaymentMethods findbyCode(String code) {
        return paymentMethodRepository
                .findByCodeAndStatus(code, "active")
                .orElseThrow(() ->
                        new RuntimeException("Payment method không hợp lệ: " + code)
                );

    }
}
