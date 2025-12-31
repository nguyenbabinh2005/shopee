package binh.shopee.dto.admin;
import lombok.*;
import java.math.BigDecimal;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VariantAdminRequest {
    private String attributesJson;
    private BigDecimal priceOverride;
}