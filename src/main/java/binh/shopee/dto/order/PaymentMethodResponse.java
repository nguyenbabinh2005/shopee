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
    private String code; // "COD", "MOMO", "VNPAY"
    private String name; // "Thanh toán khi nhận hàng", "Ví Momo"
}
