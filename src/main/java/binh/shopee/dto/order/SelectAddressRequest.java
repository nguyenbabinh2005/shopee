package binh.shopee.dto.order;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelectAddressRequest {
    private List<VariantItem> variants;
    private Long addressId;   // địa chỉ user chọn
    private Long shippingMethodId;      // ⭐ Giữ shipping đã chọn
    private String voucherCode;          // ⭐ Giữ voucher đã chọn
    private String paymentMethodCode;    // ⭐ Giữ payment đã chọn
}
