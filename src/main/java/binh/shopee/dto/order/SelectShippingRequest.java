package binh.shopee.dto.order;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SelectShippingRequest {
    List<VariantItem> variants;
    private Long shippingMethodId;
}
