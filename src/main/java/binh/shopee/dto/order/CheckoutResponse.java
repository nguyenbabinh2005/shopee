package binh.shopee.dto.order;

import binh.shopee.dto.product.VariantInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {

    private List<CheckoutItemResponse> items;

    private BigDecimal subtotal;
    private BigDecimal shippingFee;        // default shipping
    private BigDecimal orderDiscount;     // = 0
    private BigDecimal finalTotal;

    // 3️⃣ Options cho user chọn
    private List<ShippingMethodResponse> shippingMethods;
    private ShippingMethodResponse selectedShipping;
}
