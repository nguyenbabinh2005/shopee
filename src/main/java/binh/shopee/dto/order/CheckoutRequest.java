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
public class CheckoutRequest {
    // Danh sách variant + số lượng người dùng muốn mua
    private List<VariantItem> variants;
    private String voucherCode;
    private Long shippingMethodId;
}