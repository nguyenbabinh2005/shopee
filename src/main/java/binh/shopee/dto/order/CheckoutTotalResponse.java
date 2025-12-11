package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutTotalResponse {
    private BigDecimal totalAmount;            // Tổng tiền các variant
    private BigDecimal shippingFee;            // Phí vận chuyển đã chọn
    private BigDecimal voucherDiscountAmount;  // Tiền giảm theo voucher
    private BigDecimal finalTotalAmount;       // Tổng tiền cuối cùng
}
