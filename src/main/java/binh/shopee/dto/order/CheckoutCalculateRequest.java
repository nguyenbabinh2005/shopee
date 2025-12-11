package binh.shopee.dto.order;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutCalculateRequest {

    private List<VariantItem> variants;

    private Long shippingMethodId;
    private String voucherCode;
}
