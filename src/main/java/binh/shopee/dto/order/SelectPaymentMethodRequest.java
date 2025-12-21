package binh.shopee.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelectPaymentMethodRequest {
    private List<VariantItem> variants;
    private String code;
    private Long shippingMethodId;       // ⭐ Giữ shipping đã chọn
    private String voucherCode;          // ⭐ Giữ voucher đã chọn
}
