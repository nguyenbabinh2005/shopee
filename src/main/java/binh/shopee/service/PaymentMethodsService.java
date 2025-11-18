package binh.shopee.service;

import binh.shopee.dto.order.PaymentMethodResponse;
import binh.shopee.repository.PaymentMethodsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodsService {
    private final PaymentMethodsRepository paymentMethodRepository;

    public List<PaymentMethodResponse> getAvailableMethods() {
        // Lấy tất cả phương thức thanh toán đang active
        return paymentMethodRepository.findByStatus("active");
    }
}
