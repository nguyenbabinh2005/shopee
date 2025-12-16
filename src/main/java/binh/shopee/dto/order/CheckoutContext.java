package binh.shopee.dto.order;

import binh.shopee.dto.order.CheckoutItemResponse;
import binh.shopee.dto.order.ShippingMethodResponse;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutContext {

    // Item đã được validate + snapshot giá
    private List<CheckoutItemResponse> items;

    // Tổng tiền item (đã áp discount sản phẩm)
    private BigDecimal subtotal;

    // Shipping hiện tại
    private ShippingMethodResponse selectedShipping;
    private BigDecimal shippingFee;

    // Voucher
    private Long appliedVoucherId;          // nullable
    private BigDecimal orderDiscountAmount; // voucher discount

    // Kết quả cuối
    private BigDecimal finalTotal;
}
