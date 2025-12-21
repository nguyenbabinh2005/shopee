package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentMethodResponse {
    private Long paymentMethodId;
    private String code; // "COD", "MOMO", "VNPAY"
    private String displayName; // "Thanh toán khi nhận hàng", "Ví Momo"
}
